using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;

namespace sopka.Services.EquipmentLogMatcher
{
    public class ConditionExpressionParser
    {
        private readonly static HashSet<char> Tokens = new HashSet<char>() {'&', '|'};
        private readonly static MethodInfo Contains = typeof(string).GetMethod("Contains", new[] { typeof(string) });
        private readonly static MethodInfo StartsWith = typeof(string).GetMethod("StartsWith", new[] { typeof(string) });
        private readonly static MethodInfo EndsWith = typeof(string).GetMethod("EndsWith", new[] { typeof(string) });

        private readonly string _expression;

        public ConditionExpressionParser(string expression)
        {
            if (string.IsNullOrEmpty(expression)) throw new ArgumentNullException(nameof(expression));
            _expression = expression.Trim();
        }

        public Func<string, bool> Parse()
        {
            var argument = Expression.Parameter(typeof(string));
            var startPosition = 0;
            
            var expression = PrepareExpression(_expression, argument, ref startPosition);
            return Expression.Lambda<Func<string, bool>>(expression, argument).Compile();
        }

        protected Expression PrepareExpression(string expression, ParameterExpression argument, ref int startPosition)
        {
            Expression leftExpression;
            while (startPosition < expression.Length && expression[startPosition] == ' ')
            {
                startPosition = startPosition + 1;
            }

            if (expression[startPosition] == '(')
            {
                var subExpression = ExtractExpression(expression, startPosition);
                
                startPosition = startPosition + subExpression.Length - 2;
                var subStartPosition = 0;
                leftExpression = PrepareExpression(subExpression.Trim(), argument, ref subStartPosition);
            }
            else
            {
                Expression startExpression, middleExpression, endExpression;
                
                var token = ParseToken(expression, ref startPosition);
                var trimmedToken = token.Trim();
                if (trimmedToken[0] == '*' || trimmedToken[trimmedToken.Length - 1] == '*' && trimmedToken.Length > 1)
                {
                    if (trimmedToken[0] == '*' && trimmedToken[trimmedToken.Length - 1] == '*')
                    {
                        trimmedToken = trimmedToken.Substring(1, trimmedToken.Length - 2);
                        leftExpression = Expression.Call(argument, Contains, Expression.Constant($"{trimmedToken} ", typeof(string)));
                    }
                    else if (trimmedToken[0] == '*')
                    {
                        trimmedToken = trimmedToken.Substring(1, trimmedToken.Length - 1);
                        middleExpression = Expression.Call(argument, Contains, Expression.Constant($"{trimmedToken} ", typeof(string)));
                        endExpression = Expression.Call(argument, EndsWith, Expression.Constant($"{trimmedToken}", typeof(string)));
                        leftExpression = Expression.Or(middleExpression, endExpression);
                    }
                    else
                    {
                        trimmedToken = trimmedToken.Substring(0, trimmedToken.Length - 2);
                        startExpression = Expression.Call(argument, StartsWith, Expression.Constant($"{trimmedToken}", typeof(string)));
                        middleExpression = Expression.Call(argument, Contains, Expression.Constant($" {trimmedToken}", typeof(string)));
                        leftExpression = Expression.Or(startExpression, middleExpression);
                    }
                }
                else
                {
                    startExpression = Expression.Call(argument, StartsWith, Expression.Constant($"{trimmedToken} ", typeof(string)));
                    middleExpression = Expression.Call(argument, Contains, Expression.Constant($" {trimmedToken} ", typeof(string)));
                    endExpression = Expression.Call(argument, EndsWith, Expression.Constant($" {trimmedToken}", typeof(string)));
                    leftExpression = Expression.Or(Expression.Or(startExpression, middleExpression), endExpression);
                }
            }

            var op = ParseOperator(expression, ref startPosition);
            if (string.IsNullOrEmpty(op) == false)
            {
                if (startPosition < expression.Length) startPosition = startPosition + 1;
                var rightExpression = PrepareExpression(expression.Trim(), argument, ref startPosition);
                
                var opExp = op == "&" ? Expression.And(leftExpression, rightExpression) : Expression.Or(leftExpression, rightExpression);
                return opExp;
            }
            return leftExpression;
        }

        protected string ParseToken(string expression, ref int startPosition)
        {
            var builder = new StringBuilder();
            for (var i = startPosition; i < expression.Length; i++)
            {
                startPosition = i;
                if (Tokens.Contains(expression[i]))
                {
                    return builder.ToString();
                }

                if (expression[i] == '(')
                {

                }
                builder.Append(expression[i]);
            }
            return builder.ToString();
        }

        /// <summary>
        /// Достает подстроку выражения 
        /// </summary>
        /// <returns></returns>
        protected string ExtractExpression(string expression, int startPosition)
        {
            if (expression.Length > startPosition && expression[startPosition] == '(')
            {
                int entersCount = 0;
                for (int i = startPosition + 1; i < expression.Length; i++)
                {
                    if (expression[i] == '(') entersCount++;
                    if(expression[i] == ')')
                    {
                        if (entersCount == 0)
                        {
                            return expression.Substring(startPosition + 1, i - 1 - startPosition);
                        }
                        entersCount--;
                    }
                }
            }
            return expression;
        }

        protected string ParseOperator(string expression, ref int startPosition)
        {
            for (var i = startPosition; i < expression.Length; i++)
            {
                startPosition = i;
                if (Tokens.Contains(expression[i]))
                {
                    return expression[i].ToString();
                }
            }
            return string.Empty;
        }
    }
}

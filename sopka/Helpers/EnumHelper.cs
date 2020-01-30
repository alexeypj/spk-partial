using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using System.Threading;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace sopka.Helpers
{
    public static class EnumHelper
    {
        public static string GetName<T>(this T enumeration) where T : struct, IConvertible
        {
            return EnumHelperX<T>.Names[enumeration];
            //var attrs = enumeration.GetDisplayAttribute();
            //return attrs != null ? attrs.GetName() : enumeration.ToString();
        }

        public static string GetNameShort<T>(this T enumeration)
        {
            var attrs = enumeration.GetDisplayAttribute();
            return attrs != null ? attrs.GetShortName() : enumeration.ToString();
        }

        public static string GetDescription<T>(this T enumeration) where T : struct, IConvertible
        {
            return EnumHelperX<T>.Descriptions[enumeration];
            //var attrs = enumeration.GetDisplayAttribute();
            //return attrs != null ? attrs.GetDescription() : enumeration.ToString();
        }

        public static int GetOrder<T>(this T enumeration)
            where T : struct
        {
            return enumeration.GetDisplayAttribute()?.GetOrder() ?? -1;
        }

        public static DisplayAttribute GetDisplayAttribute<T>(this T enumeration)
        {
            var displayAttributeType = typeof(DisplayAttribute);

            var field = enumeration
                            .GetType()
                            .GetField(enumeration.ToString());

            return field?.GetCustomAttributes(displayAttributeType, false).FirstOrDefault() as DisplayAttribute;
        }

        public static SelectList ToSelectList<T>(string selected = null, T[] skipedValues = null)
        {
            Type t = typeof(T).IsGenericType
                        ? typeof(T).GetGenericArguments()[0]
                        : typeof(T);
            var items = new Dictionary<object, string>();
            var displayAttributeType = typeof(DisplayAttribute);

            foreach (T value in Enum.GetValues(t))
            {
                var field = value.GetType().GetField(value.ToString());
                var attrs = (DisplayAttribute)field.GetCustomAttributes(displayAttributeType, false).FirstOrDefault();
                if (skipedValues != null && skipedValues.Contains(value))
                    continue;

                items.Add((int)(object)value, attrs != null ? attrs.GetName() : value.ToString());
            }

            return new SelectList(items.OrderBy(x => x.Value), "Key", "Value", selected);
        }
    }


    [AttributeUsage(AttributeTargets.Enum)]
    public class EnumDescriptionAttribute : Attribute
    {
        public string NamePrefix { get; set; }
    }

    public static class EnumHelperX<T> where T : struct, IConvertible
    {
        private static readonly Type _type = typeof(T);
        private static readonly Lazy<Dictionary<T, string>> _descriptions = new Lazy<Dictionary<T, string>>(getDescriptions, LazyThreadSafetyMode.PublicationOnly);
        private static Lazy<Dictionary<T, string>> _names = new Lazy<Dictionary<T, string>>(getNames, LazyThreadSafetyMode.PublicationOnly);
        private static readonly Lazy<T[]> _values = new Lazy<T[]>(() => (T[])Enum.GetValues(_type), LazyThreadSafetyMode.PublicationOnly);
        private static Lazy<Dictionary<string, T>> _displayNameToValue = new Lazy<Dictionary<string, T>>(GetDisplayNameToValueDict, LazyThreadSafetyMode.PublicationOnly);

        private static string _namePrefix = "";

        static EnumHelperX()
        {
            if (!_type.IsEnum)
                throw new InvalidOperationException();
            var attr = _type.GetCustomAttribute<EnumDescriptionAttribute>();
            if (attr != null)
                _namePrefix = attr.NamePrefix;
        }

        public static string GetDescription(T enumeration)
        {
            return _descriptions.Value[enumeration];
        }

        public static string GetName(T enumeration)
        {
            return _names.Value[enumeration];
        }

        public static T GetValueFromName(string name)
        {
            if (_displayNameToValue.Value.TryGetValue(name, out var result))
                return result;
            throw new ArgumentOutOfRangeException("name");
        }

        public static Dictionary<T, string> Descriptions => _descriptions.Value;
        public static Dictionary<T, string> Names => _names.Value;

        private static Dictionary<T, string> getDescriptions()
        {
            var enumVals = _values.Value;
            var result = new Dictionary<T, string>(enumVals.Length);
            foreach (var val in enumVals)
            {
                var attrs = val.GetDisplayAttribute();
                var description = attrs != null ? attrs.GetDescription() : val.ToString();
                result.Add(val, description);
            }
            return result;
        }

        private static Dictionary<T, string> getNames()
        {
            var enumVals = _values.Value;
            var result = new Dictionary<T, string>(enumVals.Length);
            foreach (var val in enumVals)
            {
                var attr = val.GetDisplayAttribute();
                var name = attr?.Name ?? _namePrefix + val.ToString();
                result.Add(val, name);
            }
            return result;
        }

        public static T[] GetValues()
        {
            return _values.Value;
        }

        public static T Parse(string val)
        {
            return (T)Enum.Parse(_type, val);
        }

        public static bool TryGetValueFromName(string name, out T enumValue)
        {
            if (_displayNameToValue.Value.TryGetValue(name, out enumValue))
                return true;

            //foreach (var field in _type.GetFields())
            //{
            //	if (Attribute.GetCustomAttribute(field, typeof(DisplayAttribute)) is DisplayAttribute attribute)
            //	{
            //		if (attribute.Name == name)
            //		{
            //			enumValue = (T)field.GetValue(null);
            //			return true;
            //		}
            //	}
            //	else
            //	{
            //		if (field.Name == name)
            //		{
            //			enumValue = (T)field.GetValue(null);
            //			return true;
            //		}

            //	}
            //}
            enumValue = default(T);
            return false;
        }

        private static Dictionary<string, T> GetDisplayNameToValueDict()
        {
            var result = new Dictionary<string, T>();
            foreach (var field in _type.GetFields(BindingFlags.Public | BindingFlags.Static))
            {
                if (Attribute.GetCustomAttribute(field, typeof(DisplayAttribute)) is DisplayAttribute attribute)
                    result.Add(attribute.Name ?? _namePrefix + field.Name, (T)field.GetValue(null));
                else
                    result.Add(_namePrefix + field.Name, (T)field.GetValue(null));
            }
            return result;
        }


        private static readonly ConcurrentDictionary<Type, ConcurrentDictionary<T, bool>> _hasEnumValueAttributeDict = new ConcurrentDictionary<Type, ConcurrentDictionary<T, bool>>();

        public static bool HasAttribute(T enumValue, Type attributeType)
        {
            var attrDict = _hasEnumValueAttributeDict.GetOrAdd(attributeType, newAttrType => new ConcurrentDictionary<T, bool>());
            var res = attrDict.GetOrAdd(enumValue, newEnumVal =>
            {
                var field = _type.GetField(enumValue.ToString());
                return field.GetCustomAttributes(attributeType, false).Any();
            });
            return res;
        }
    }
}
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace sopka.Services.Email
{
    public class EmailService
    {
        private const string ResetPasswordTemplate = "Ссылка для восстановления пароля: <a href=\"{0}\">{0}</a>";
        private const string ResetPasswordSubject = "Восстановление пароля";
		
        private const string SupportTemplate = "Обращение от {0}: </br>{1}";
        private const string SupportSubject = "Обращение в тех. поддержку";

        private const string RegisterUserTemplate = "Пользователь {0} с именем пользователя {1} зарегистрирован. Установлен временный пароль {2}";
        private const string RegisterUserSubject = "Зарегистрирован новый пользователь";

        private const string UpdatePasswordTemplate = "Изменен пароль для пользователя {0}. Новый пароль {1}";
        private const string UpdatePasswordSubject = "Изменен пароль для пользователя";
        
        private readonly SmtpSettings _smtpSettings;

        public EmailService(SmtpSettings settings)
        {
	        _smtpSettings = settings;
        }

        /// <summary>
        /// Отправка письма для сброса пароля
        /// </summary>
        /// <param name="to">email</param>
        /// <param name="resetUrl">Ссылка на сброc пароля</param>
        public async Task SendResetPassword(string to, string resetUrl)
        {
            var text = string.Format(ResetPasswordTemplate, resetUrl);
            await Send(to, ResetPasswordSubject, text);
        }

        public async Task SendToSupport(string contactEmail, string text)
        {
            var body = string.Format(SupportTemplate, contactEmail, text);
            await Send(_smtpSettings.SupportEmail, SupportSubject, body);
        }

        public async Task NewUser(string to, string fio, string pwd)
        {
	        await Send(to, RegisterUserSubject, string.Format(RegisterUserTemplate, fio, to, pwd));
		}

        public async Task UpdatePassword(string to, string pwd)
        {
            await Send(to, UpdatePasswordSubject, string.Format(UpdatePasswordTemplate, to, pwd));
        }

        public async Task BlockUser(string to, bool isBlocked, string reason = "")
        {
	        var blocked = isBlocked ? "заблокирован" : "разблокирован";
	        var text = new StringBuilder();
	        text.Append($"Пользователь {to} {blocked}.");
	        if (isBlocked)
	        {
		        text.Append($" Причина блокировки: {reason}.");
	        }
	        await Send(to, $"Пользователь {blocked}", text.ToString());
        }

		public async Task Send(string to, string subject, string text)
        {
            using (var client = new SmtpClient(_smtpSettings.SmtpServer, _smtpSettings.SmtpServerPort))
            {
                client.Timeout = _smtpSettings.SmtpTimeout;
                client.EnableSsl = _smtpSettings.EnableSsl;
                var from = new MailAddress(_smtpSettings.FromEmail, _smtpSettings.FromEmailName);
                var message = new MailMessage(from, new MailAddress(to));
                message.Body = text;
                message.IsBodyHtml = true;
                message.Subject = subject;
                if (string.IsNullOrEmpty(_smtpSettings.BccMail) == false)
                {
					message.Bcc.Add(_smtpSettings.BccMail);
                }
                await client.SendMailAsync(message);
            }
        }
    }
}
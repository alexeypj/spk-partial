namespace sopka.Infrastructure.Http
{
	/// <summary>
	/// Интерфейс описывает параметры для ограничения максимального размера файла
	/// </summary>
	public interface IFormFileLengthLimit
	{
		/// <summary>
		/// Максимальный размер
		/// </summary>
		long Value { get; }

		/// <summary>
		/// Максимальный размер в Мб
		/// </summary>
		float ValueMb { get; }
	}

	public class FormFileLengthLimit : IFormFileLengthLimit
	{
		public FormFileLengthLimit(long value)
		{
			Value = value;
			ValueMb = (value / 1024f) / 1024f;
		}

		public long Value { get; private set; }

		public float ValueMb { get; private set; }
	}
}

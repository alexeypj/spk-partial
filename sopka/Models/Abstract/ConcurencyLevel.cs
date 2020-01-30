namespace sopka.Models.Abstract
{
    public class ConcurrencyLevel
    {
        public ConcurrencyLevel(int threads)
        {
            Threads = threads;
        }

        public int Threads { get;}
    }
}

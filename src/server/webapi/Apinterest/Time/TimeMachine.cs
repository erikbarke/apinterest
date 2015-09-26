using System;

namespace Apinterest.Time
{
    public class TimeMachine : ITimeMachine
    {
        public DateTime DateTime
        {
            get
            {
                var now = DateTime.Now;
                return new DateTime(now.Year, now.Month, now.Day, now.Hour, now.Minute, now.Second);
            }
        }

        public TimeSpan Time
        {
            get
            {
                var now = DateTime.Now.TimeOfDay;
                return new TimeSpan(now.Hours, now.Minutes, now.Seconds);
            }
        }
    }
}

using System;

namespace Apinterest.Time
{
    public interface ITimeMachine
    {
        DateTime DateTime { get; }
        TimeSpan Time { get; }
    }
}

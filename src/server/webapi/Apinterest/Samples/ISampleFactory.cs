using System;

namespace Apinterest.Samples
{
    public interface ISampleFactory
    {
        Sample CreateSample(Type type);
    }
}

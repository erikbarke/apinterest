using System;

namespace Apinterest.UnitTests.Mocks
{
    public class MockClassWithAngryConstructor
    {
        public MockClassWithAngryConstructor(string parameter)
        {
            throw new ArgumentException("Invalid parameter value: " + parameter);
        }
    }
}

using System.Collections.Generic;

namespace Apinterest.UnitTests.Mocks
{
    public class MockComplexObject
    {
        public int Integer { get; set; }
        public string String { get; set; }
        public bool Boolean { get; set; }
        public IEnumerable<string> StringList { get; set; }
        public IDictionary<string, MockComplexListObject> Dictionary { get; set; }
    }
}

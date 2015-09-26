using System.Collections.Generic;

namespace Apinterest.UnitTests.Mocks
{
    public class MockClassWithCircularReferences
    {
        public MockClassWithCircularReferences(MockClassWithCircularReferences meta)
        {
            MetaReference = meta;
        }

        public MockClassWithCircularReferences MetaReference { get; private set; }
        public string String { get; set; }
        public MockClass PropertyWithCircularReference { get; set; }
        public IList<MockClassWithCircularReferences> ListWithCircularReferences { get; set; }
    }
}

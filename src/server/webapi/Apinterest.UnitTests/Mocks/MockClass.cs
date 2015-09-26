using System;
using System.Collections.Generic;

namespace Apinterest.UnitTests.Mocks
{
    public class MockClass : MockBaseClass
    {
        public const int PublicIntConstant = 123;
        public const string PublicStringConstant = "constant string";

        public readonly DateTime PublicReadonlyDateTime = new DateTime(1983, 06, 13);

        public static int PublicStaticInt;
        public static string PublicStaticString;

        public int PublicInt;
        public string PublicString;

        public Guid Guid { get; set; }
        public IEnumerable<MockClassWithCircularReferences> Enumerable { get; set; }
        public MockStruct Struct { get; set; }
        public IDictionary<string, int> Dictionary { get; set; }
        public MockClassType Enum { get; set; }
        public DateTime? Date { get; set; }
        public sbyte? NullableSbyte { get; set; }
        public long? NullableLong { get; set; }
        public decimal Decimal { get; set; }
        public bool Boolean { get; set; }
    }
}

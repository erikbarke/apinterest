using System.Collections.Generic;

namespace Apinterest.Validation
{
    public class Validator
    {
        public string Type { get; set; }
        public string Category { get; set; }
        public string Path { get; set; }
        public string Pattern { get; set; }
        public string FriendlyPattern { get; set; }
        public object MinValue { get; set; }
        public object MaxValue { get; set; }
        public IEnumerable<string> Values { get; set; }
    }
}

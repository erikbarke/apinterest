using System.Collections.Generic;
using Newtonsoft.Json;

namespace Apinterest.Contracts
{
    public class ValidatorContract
    {
        public string Type { get; set; }
        public string Category { get; set; }
        public string Path { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Pattern { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string FriendlyPattern { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public object MinValue { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public object MaxValue { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public IEnumerable<string> Values { get; set; }
    }
}

using System.Collections.Generic;

namespace Apinterest.Contracts
{
    public class ParameterContract
    {
        public ParameterContract()
        {
            Validators = new List<ValidatorContract>();
        }

        public string Source { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Category { get; set; }
        public object Sample { get; set; }
        public IEnumerable<ValidatorContract> Validators { get; set; } 
    }
}

using System.Collections.Generic;

namespace Apinterest.Contracts
{
    public class ResponseContract
    {
        public ResponseContract()
        {
            Validators = new List<ValidatorContract>();
        }

        public string Type { get; set; }
        public string Category { get; set; }
        public object Sample { get; set; }
        public IEnumerable<ValidatorContract> Validators { get; set; } 
    }
}

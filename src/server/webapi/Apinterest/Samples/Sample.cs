
using System.Collections.Generic;
using Apinterest.Validation;

namespace Apinterest.Samples
{
    public class Sample
    {
        public Sample(object instance, string category, IEnumerable<Validator> validators)
        {
            Instance = instance;
            Category = category;
            Validators = validators;
        }

        public object Instance { get; private set; }
        public string Category { get; private set; }
        public IEnumerable<Validator> Validators { get; private set; }
    }
}

using System;

namespace Apinterest.Validation
{
    public interface IValidatorFactory
    {
        Validator GetValidator(Type type, string path);
    }
}

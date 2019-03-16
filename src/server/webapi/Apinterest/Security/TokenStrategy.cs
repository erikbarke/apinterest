namespace Apinterest.Security
{
    public class TokenStrategy
    {
        public TokenStrategy(string tokenUrl, string requestBodyTemplate)
        {
            TokenUrl = tokenUrl;
            RequestBodyTemplate = requestBodyTemplate;
        }

        public string TokenUrl { get; }
        public string RequestBodyTemplate { get; }
    }
}

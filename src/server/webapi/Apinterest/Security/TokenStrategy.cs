namespace Apinterest.Security
{
    public class TokenStrategy
    {
        public TokenStrategy(string url, string requestBodyTemplate)
        {
            Url = url;
            RequestBodyTemplate = requestBodyTemplate;
        }

        public string Url { get; }
        public string RequestBodyTemplate { get; }
    }
}

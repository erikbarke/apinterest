namespace Apinterest.Security
{
    public class TokenStrategyResolver
    {
        public TokenStrategy Resolve()
        {
            return new TokenStrategy("./Token", "grant_type=password&username=${username}&password=${password}");
        }
    }
}

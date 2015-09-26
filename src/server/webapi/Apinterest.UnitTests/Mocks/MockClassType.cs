namespace Apinterest.UnitTests.Mocks
{
    public enum MockClassType
    {
        CodeSmell = 2,
        CargoCult = 4,
        Yagni = 8,
        PrematureOptimization = 16,
        EvilSingleton = 32,
        BigBallOfMud = CodeSmell | CargoCult | Yagni | PrematureOptimization | EvilSingleton
    }
}

using DataAccess;

namespace tests;

public class SetupTests(MyDbContext ctx)
{
    [Fact]
    public void XunitDependencyInjectionCanFindService()
    {
        Assert.Equal(0, ctx.Boards.ToList().Count);
    }
}
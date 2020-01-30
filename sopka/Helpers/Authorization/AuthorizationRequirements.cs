using Microsoft.AspNetCore.Authorization;

namespace sopka.Helpers.Authorization
{
    public class SuperAdminOrPaidCompanyRequirement: IAuthorizationRequirement
    {
        
    }

    public class SuperAdminRequirement: IAuthorizationRequirement
    {
        
    }

    public class CompanyUserRequirement: IAuthorizationRequirement
    {
        
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sopka.Services.Workflow
{
    public interface IWorkflow
    {
        bool ChangeState(IncidentTrigger trigger);
    }
}

import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointer, MousePointerIcon } from "lucide-react";
import { ManualTriggerDialog } from "./dialog";

export const ManualTriggerNode = memo((props: NodeProps) => {
    const [dialogOpen,setDialogOpen]=useState(false)
    return(
        <>
        <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen}/>
            <BaseTriggerNode
                {...props}
                icon={MousePointerIcon}
                name="When clicking 'Execute workflow' button"
                // status={nodeStatus}
                // onSettings={handleOpenSettings} TODO
                // onDoubleClick={handleOpenSettings}
            />
        </>
    )

});
ManualTriggerNode.displayName = "ManualTriggerNode";
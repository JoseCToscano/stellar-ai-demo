import * as React from "react"
import { Github, MessagesSquare } from "lucide-react"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ThreadList } from "./assistant-ui/thread-list"
import { env } from "../env"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
                <Link href="https://assistant-ui.com" target="_blank">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <MessagesSquare className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">Stellar AI Agent Kit</span>
                  </div>
                </Link>
              </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <ThreadList />
        
        {/* Resources Section */}
        <div className="px-2 mt-6 space-y-3">
          <div className="px-2 py-1">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Resources
            </h3>
          </div>
          
          {/* Project Story */}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="h-auto py-2">
                <Link href="https://dorahacks.io/buidl/25271" target="_blank">
                  <div className="w-5 h-5 bg-gradient-to-r from-orange-500 to-red-500 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">🚀</span>
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-medium text-sm leading-tight">How it all started</span>
                    <span className="text-xs text-muted-foreground leading-tight">DoraHacks Project</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="h-auto py-2">
                <Link href={env.NEXT_PUBLIC_SCF_SUBMISSION_URL} target="_blank">
                  <div className="w-5 h-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">⭐</span>
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-medium text-sm leading-tight">SCF Build Award</span>
                    <span className="text-xs text-muted-foreground leading-tight">Fund Submission</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          
          {/* Documentation */}
          <div className="px-2 py-1 pt-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Documentation
            </h3>
          </div>
          
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="h-auto py-2">
                <Link href="https://docs.google.com/document/d/1yk4VSQFQrf35UfSnRO-OpOQ0rxs-dIjlh_GeZK4x_NA/edit?usp=sharing" target="_blank">
                  <div className="w-5 h-5 bg-muted rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">📄</span>
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-medium text-sm leading-tight">Technical Documentation</span>
                    <span className="text-xs text-muted-foreground leading-tight">Complete guide</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="h-auto py-2">
                <Link href="https://modelcontextprotocol.io/introduction" target="_blank">
                  <div className="w-5 h-5 bg-muted rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">🔗</span>
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-medium text-sm leading-tight">Model Context Protocol</span>
                    <span className="text-xs text-muted-foreground leading-tight">Learn about MCP</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="h-auto py-2">
                <Link href="https://a16z.com/a-deep-dive-into-mcp-and-the-future-of-ai-tooling/" target="_blank">
                  <div className="w-5 h-5 bg-muted rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">📖</span>
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-medium text-sm leading-tight">A16z MCP Deep Dive</span>
                    <span className="text-xs text-muted-foreground leading-tight">Future of AI tooling</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          
          
        </div>
      </SidebarContent>
      
      <SidebarRail />
      <SidebarFooter>
        <SidebarMenu>
         
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="https://github.com/JoseCToscano/stellar-ai-demo" target="_blank">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Github className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">GitHub</span>
                  <span className="">View Source</span>
                </div>
              </Link>
            </SidebarMenuButton>
            
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

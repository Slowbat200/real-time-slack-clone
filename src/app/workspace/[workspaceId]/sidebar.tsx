import { UserButton } from '@/features/auth/components/user-button';
import { WorkspaceSwitcher } from './workspace-switcher';
import { SidebarButton } from './sidebar-button';
import { Bell, Home, MessageSquareIcon, MoreHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';

export const Sidebar = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <aside className='w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[9px] pb-[4px]'>
      <WorkspaceSwitcher />
      <SidebarButton icon={Home} label='Home' isActive/>
      <SidebarButton icon={MessageSquareIcon} label='DMs' isActive/>
      <SidebarButton icon={Bell} label='Activity' isActive/>
      <SidebarButton icon={MoreHorizontal} label='More' isActive/>
      <div className='flex flex-col items-center justify-center gap-y-1 mt-auto'>
        <UserButton />
      </div>
    </aside>
  );
};

'use client';

import { FaChevronDown } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import { TrashIcon } from 'lucide-react';

import { useState } from 'react';

import { useRemoveChannel } from '@/features/channels/api/use-remove-channel';
import { useUpdateChannel } from '@/features/channels/api/use-update-channel';

import { useChannelId } from '@/hooks/use-channel-id';
import { useConfirm } from '@/hooks/use-confirm';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HeaderProps {
  memberName?: string;
  memberImage?: string;
  onClick?: () => void;
}

export const Header = ({
  memberName = 'Member',
  memberImage,
  onClick,
}: HeaderProps) => {
  const avatarFallback = memberName.charAt(0).toUpperCase();
  return (
    <div className='bg-white border-b h-[49px] flex items-center px-4 overflow-hidden text-black'>
      <Button
        variant='ghost'
        className='text-lg font-semibold px-2 overflow-hidden w-auto'
        size='sm'
        onClick={onClick}
      >
        <Avatar className='size-6 mr-2'>
          <AvatarImage src={memberImage} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <span className='truncate'>{memberName}</span>
        <FaChevronDown className='size-2.5 ml-2'/>
      </Button>
    </div>
  );
};

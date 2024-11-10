import { usePaginatedQuery } from 'convex/react';

import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

const BATCH_SIZE = 20;

/* The `interface UseGetMessagesProps` is defining a TypeScript interface that specifies the properties
that can be passed to the `useGetMessages` function. In this case, it defines three optional
properties: `channelId`, `conversationId`, and `parentMessageId`, each of which is expected to be of
type `Id<'channels'>`, `Id<'conversations'>`, and `Id<'messages'>` respectively. */
interface UseGetMessagesProps {
  channelId?: Id<'channels'>;
  conversationId?: Id<'conversations'>;
  parentMessageId?: Id<'messages'>;
}

export type GetMessagesReturnType = typeof api.messages.get._returnType['page']

export const useGetMessages = ({
  channelId,
  conversationId,
  parentMessageId,
}: UseGetMessagesProps) => {
  const {results, status, loadMore} = usePaginatedQuery(
    api.messages.get,
    { channelId, conversationId, parentMessageId },
    { initialNumItems: BATCH_SIZE }
  );
  return{
    results,
    status,
    loadMore: () => loadMore(BATCH_SIZE)
  }
};

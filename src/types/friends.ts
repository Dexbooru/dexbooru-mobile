export type TChatFriend = {
  id: string;
  username: string;
  profilePictureUrl: string;
};

export type TFriendData = {
  friends: TChatFriend[];
  sentFriendRequests: (TChatFriend & { sentAt: string })[];
  receivedFriendRequests: (TChatFriend & { sentAt: string })[];
};

export type TFriendRequestAction = 'accept' | 'decline';
export type TFriendStatus =
  | 'not-friends'
  | 'request-pending'
  | 'are-friends'
  | 'is-self'
  | 'irrelevant';

export type TFriendRequestHandleBody = {
  action: TFriendRequestAction;
};

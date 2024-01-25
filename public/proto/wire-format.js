/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
'use strict'

var $protobuf = require('protobufjs/light')

var $root = (
  $protobuf.roots['default'] ||
  ($protobuf.roots['default'] = new $protobuf.Root())
).addJSON({
  TikTok: {
    nested: {
      WebcastResponse: {
        fields: {
          messages: {
            rule: 'repeated',
            type: 'Message',
            id: 1
          },
          cursor: {
            type: 'string',
            id: 2
          },
          fetchInterval: {
            type: 'int32',
            id: 3
          },
          serverTimestamp: {
            type: 'int64',
            id: 4
          },
          internalExt: {
            type: 'string',
            id: 5
          },
          fetchType: {
            type: 'int32',
            id: 6
          },
          wsParam: {
            type: 'WebsocketParam',
            id: 7
          },
          heartbeatDuration: {
            type: 'int32',
            id: 8
          },
          needAck: {
            type: 'bool',
            id: 9
          },
          wsUrl: {
            type: 'string',
            id: 10
          }
        }
      },
      Message: {
        fields: {
          type: {
            type: 'string',
            id: 1
          },
          binary: {
            type: 'bytes',
            id: 2
          }
        }
      },
      WebsocketParam: {
        fields: {
          name: {
            type: 'string',
            id: 1
          },
          value: {
            type: 'string',
            id: 2
          }
        }
      },
      WebcastControlMessage: {
        fields: {
          action: {
            type: 'int32',
            id: 2
          }
        }
      },
      WebcastRoomUserSeqMessage: {
        fields: {
          topViewers: {
            rule: 'repeated',
            type: 'TopUser',
            id: 2
          },
          viewerCount: {
            type: 'int32',
            id: 3
          }
        }
      },
      TopUser: {
        fields: {
          coinCount: {
            type: 'uint64',
            id: 1
          },
          user: {
            type: 'User',
            id: 2
          }
        }
      },
      WebcastChatMessage: {
        fields: {
          event: {
            type: 'WebcastMessageEvent',
            id: 1
          },
          user: {
            type: 'User',
            id: 2
          },
          comment: {
            type: 'string',
            id: 3
          },
          subemotes: {
            rule: 'repeated',
            type: 'WebcastSubEmotes',
            id: 13
          }
        }
      },
      WebcastSubEmotes: {
        fields: {
          placeInComment: {
            type: 'int32',
            id: 1
          },
          emote: {
            type: 'EmoteDetails',
            id: 2
          }
        }
      },
      WebcastMemberMessage: {
        fields: {
          event: {
            type: 'WebcastMessageEvent',
            id: 1
          },
          user: {
            type: 'User',
            id: 2
          },
          actionId: {
            type: 'int32',
            id: 10
          }
        }
      },
      WebcastGiftMessage: {
        fields: {
          event: {
            type: 'WebcastMessageEvent',
            id: 1
          },
          giftId: {
            type: 'int32',
            id: 2
          },
          repeatCount: {
            type: 'int32',
            id: 5
          },
          user: {
            type: 'User',
            id: 7
          },
          repeatEnd: {
            type: 'int32',
            id: 9
          },
          groupId: {
            type: 'uint64',
            id: 11
          },
          giftDetails: {
            type: 'WebcastGiftMessageGiftDetails',
            id: 15
          },
          monitorExtra: {
            type: 'string',
            id: 22
          },
          giftExtra: {
            type: 'WebcastGiftMessageGiftExtra',
            id: 23
          }
        }
      },
      WebcastGiftMessageGiftDetails: {
        fields: {
          giftImage: {
            type: 'WebcastGiftMessageGiftImage',
            id: 1
          },
          giftName: {
            type: 'string',
            id: 16
          },
          describe: {
            type: 'string',
            id: 2
          },
          giftType: {
            type: 'int32',
            id: 11
          },
          diamondCount: {
            type: 'int32',
            id: 12
          }
        }
      },
      WebcastGiftMessageGiftExtra: {
        fields: {
          timestamp: {
            type: 'uint64',
            id: 6
          },
          receiverUserId: {
            type: 'uint64',
            id: 8
          }
        }
      },
      WebcastGiftMessageGiftImage: {
        fields: {
          giftPictureUrl: {
            type: 'string',
            id: 1
          }
        }
      },
      WebcastLinkMicBattle: {
        fields: {
          battleUsers: {
            rule: 'repeated',
            type: 'WebcastLinkMicBattleItems',
            id: 10
          }
        }
      },
      WebcastLinkMicBattleItems: {
        fields: {
          battleGroup: {
            type: 'WebcastLinkMicBattleGroup',
            id: 2
          }
        }
      },
      WebcastLinkMicBattleGroup: {
        fields: {
          user: {
            type: 'LinkUser',
            id: 1
          }
        }
      },
      WebcastLinkMicArmies: {
        fields: {
          battleItems: {
            rule: 'repeated',
            type: 'WebcastLinkMicArmiesItems',
            id: 3
          },
          battleStatus: {
            type: 'int32',
            id: 7
          }
        }
      },
      WebcastLinkMicArmiesItems: {
        fields: {
          hostUserId: {
            type: 'uint64',
            id: 1
          },
          battleGroups: {
            rule: 'repeated',
            type: 'WebcastLinkMicArmiesGroup',
            id: 2
          }
        }
      },
      WebcastLinkMicArmiesGroup: {
        fields: {
          users: {
            rule: 'repeated',
            type: 'User',
            id: 1
          },
          points: {
            type: 'int32',
            id: 2
          }
        }
      },
      WebcastSocialMessage: {
        fields: {
          event: {
            type: 'WebcastMessageEvent',
            id: 1
          },
          user: {
            type: 'User',
            id: 2
          }
        }
      },
      WebcastLikeMessage: {
        fields: {
          event: {
            type: 'WebcastMessageEvent',
            id: 1
          },
          user: {
            type: 'User',
            id: 5
          },
          likeCount: {
            type: 'int32',
            id: 2
          },
          totalLikeCount: {
            type: 'int32',
            id: 3
          }
        }
      },
      WebcastQuestionNewMessage: {
        fields: {
          questionDetails: {
            type: 'QuestionDetails',
            id: 2
          }
        }
      },
      QuestionDetails: {
        fields: {
          questionText: {
            type: 'string',
            id: 2
          },
          user: {
            type: 'User',
            id: 5
          }
        }
      },
      WebcastMessageEvent: {
        fields: {
          msgId: {
            type: 'uint64',
            id: 2
          },
          createTime: {
            type: 'uint64',
            id: 4
          },
          eventDetails: {
            type: 'WebcastMessageEventDetails',
            id: 8
          }
        }
      },
      WebcastMessageEventDetails: {
        fields: {
          displayType: {
            type: 'string',
            id: 1
          },
          label: {
            type: 'string',
            id: 2
          }
        }
      },
      WebcastLiveIntroMessage: {
        fields: {
          id: {
            type: 'uint64',
            id: 2
          },
          description: {
            type: 'string',
            id: 4
          },
          user: {
            type: 'User',
            id: 5
          }
        }
      },
      SystemMessage: {
        fields: {
          description: {
            type: 'string',
            id: 2
          }
        }
      },
      WebcastInRoomBannerMessage: {
        fields: {
          data: {
            type: 'string',
            id: 2
          }
        }
      },
      RankItem: {
        fields: {
          colour: {
            type: 'string',
            id: 1
          },
          id: {
            type: 'uint64',
            id: 4
          }
        }
      },
      WeeklyRanking: {
        fields: {
          type: {
            type: 'string',
            id: 1
          },
          label: {
            type: 'string',
            id: 2
          },
          rank: {
            type: 'RankItem',
            id: 3
          }
        }
      },
      RankContainer: {
        fields: {
          rankings: {
            type: 'WeeklyRanking',
            id: 4
          }
        }
      },
      WebcastHourlyRankMessage: {
        fields: {
          data: {
            type: 'RankContainer',
            id: 2
          }
        }
      },
      EmoteDetails: {
        fields: {
          emoteId: {
            type: 'string',
            id: 1
          },
          image: {
            type: 'EmoteImage',
            id: 2
          }
        }
      },
      EmoteImage: {
        fields: {
          imageUrl: {
            type: 'string',
            id: 1
          }
        }
      },
      WebcastEnvelopeMessage: {
        fields: {
          treasureBoxData: {
            type: 'TreasureBoxData',
            id: 2
          },
          treasureBoxUser: {
            type: 'TreasureBoxUser',
            id: 1
          }
        }
      },
      TreasureBoxUser: {
        fields: {
          user2: {
            type: 'TreasureBoxUser2',
            id: 8
          }
        }
      },
      TreasureBoxUser2: {
        fields: {
          user3: {
            rule: 'repeated',
            type: 'TreasureBoxUser3',
            id: 4
          }
        }
      },
      TreasureBoxUser3: {
        fields: {
          user4: {
            type: 'TreasureBoxUser4',
            id: 21
          }
        }
      },
      TreasureBoxUser4: {
        fields: {
          user: {
            type: 'User',
            id: 1
          }
        }
      },
      TreasureBoxData: {
        fields: {
          coins: {
            type: 'uint32',
            id: 5
          },
          canOpen: {
            type: 'uint32',
            id: 6
          },
          timestamp: {
            type: 'uint64',
            id: 7
          }
        }
      },
      WebcastSubNotifyMessage: {
        fields: {
          event: {
            type: 'WebcastMessageEvent',
            id: 1
          },
          user: {
            type: 'User',
            id: 2
          },
          exhibitionType: {
            type: 'int32',
            id: 3
          },
          subMonth: {
            type: 'int32',
            id: 4
          },
          subscribeType: {
            type: 'int32',
            id: 5
          },
          oldSubscribeStatus: {
            type: 'int32',
            id: 6
          },
          subscribingStatus: {
            type: 'int32',
            id: 8
          }
        }
      },
      User: {
        fields: {
          userId: {
            type: 'uint64',
            id: 1
          },
          nickname: {
            type: 'string',
            id: 3
          },
          profilePicture: {
            type: 'ProfilePicture',
            id: 9
          },
          uniqueId: {
            type: 'string',
            id: 38
          },
          secUid: {
            type: 'string',
            id: 46
          },
          badges: {
            rule: 'repeated',
            type: 'UserBadgesAttributes',
            id: 64
          },
          createTime: {
            type: 'uint64',
            id: 16
          },
          bioDescription: {
            type: 'string',
            id: 5
          },
          followInfo: {
            type: 'FollowInfo',
            id: 22
          }
        }
      },
      FollowInfo: {
        fields: {
          followingCount: {
            type: 'int32',
            id: 1
          },
          followerCount: {
            type: 'int32',
            id: 2
          },
          followStatus: {
            type: 'int32',
            id: 3
          },
          pushStatus: {
            type: 'int32',
            id: 4
          }
        }
      },
      LinkUser: {
        fields: {
          userId: {
            type: 'uint64',
            id: 1
          },
          nickname: {
            type: 'string',
            id: 2
          },
          profilePicture: {
            type: 'ProfilePicture',
            id: 3
          },
          uniqueId: {
            type: 'string',
            id: 4
          }
        }
      },
      ProfilePicture: {
        fields: {
          urls: {
            rule: 'repeated',
            type: 'string',
            id: 1
          }
        }
      },
      UserBadgesAttributes: {
        fields: {
          badgeSceneType: {
            type: 'int32',
            id: 3
          },
          imageBadges: {
            rule: 'repeated',
            type: 'UserImageBadge',
            id: 20
          },
          badges: {
            rule: 'repeated',
            type: 'UserBadge',
            id: 21
          }
        }
      },
      UserBadge: {
        fields: {
          type: {
            type: 'string',
            id: 2
          },
          name: {
            type: 'string',
            id: 3
          }
        }
      },
      UserImageBadge: {
        fields: {
          displayType: {
            type: 'int32',
            id: 1
          },
          image: {
            type: 'UserImageBadgeImage',
            id: 2
          }
        }
      },
      UserImageBadgeImage: {
        fields: {
          url: {
            type: 'string',
            id: 1
          }
        }
      },
      WebcastWebsocketMessage: {
        fields: {
          id: {
            type: 'uint64',
            id: 2
          },
          type: {
            type: 'string',
            id: 7
          },
          binary: {
            type: 'bytes',
            id: 8
          }
        }
      },
      WebcastWebsocketAck: {
        fields: {
          id: {
            type: 'uint64',
            id: 2
          },
          type: {
            type: 'string',
            id: 7
          }
        }
      }
    }
  }
})

module.exports = $root

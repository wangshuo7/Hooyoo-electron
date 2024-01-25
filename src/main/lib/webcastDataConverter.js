/**
 * This ugly function brings the nested protobuf objects to a flat level
 * In addition, attributes in "Long" format are converted to strings (e.g. UserIds)
 * This makes it easier to handle the data later, since some libraries have problems to serialize this protobuf specific data.
 */
export function simplifyObject(webcastObject) {
  if (webcastObject.questionDetails) {
    Object.assign(webcastObject, webcastObject.questionDetails)
    delete webcastObject.questionDetails
  }

  if (webcastObject.user) {
    Object.assign(webcastObject, getUserAttributes(webcastObject.user))
    delete webcastObject.user
  }

  if (webcastObject.event) {
    Object.assign(webcastObject, getEventAttributes(webcastObject.event))
    delete webcastObject.event
  }

  if (webcastObject.eventDetails) {
    Object.assign(webcastObject, webcastObject.eventDetails)
    delete webcastObject.eventDetails
  }

  if (webcastObject.topViewers) {
    webcastObject.topViewers = getTopViewerAttributes(webcastObject.topViewers)
  }

  if (webcastObject.battleUsers) {
    const battleUsers = []
    webcastObject.battleUsers.forEach((user) => {
      if (user?.battleGroup?.user) {
        battleUsers.push(getUserAttributes(user.battleGroup.user))
      }
    })

    webcastObject.battleUsers = battleUsers
  }

  if (webcastObject.battleItems) {
    webcastObject.battleArmies = []
    webcastObject.battleItems.forEach((battleItem) => {
      battleItem.battleGroups.forEach((battleGroup) => {
        const group = {
          hostUserId: battleItem.hostUserId.toString(),
          points: parseInt(battleGroup.points),
          participants: []
        }

        battleGroup.users.forEach((user) => {
          group.participants.push(getUserAttributes(user))
        })

        webcastObject.battleArmies.push(group)
      })
    })

    delete webcastObject.battleItems
  }

  if (webcastObject.giftId) {
    // Convert to boolean
    webcastObject.repeatEnd = !!webcastObject.repeatEnd

    // Add previously used JSON structure (for compatibility reasons)
    // Can be removed soon
    webcastObject.gift = {
      gift_id: webcastObject.giftId,
      repeat_count: webcastObject.repeatCount,
      repeat_end: webcastObject.repeatEnd ? 1 : 0,
      gift_type: webcastObject.giftDetails?.giftType
    }

    if (webcastObject.giftDetails) {
      Object.assign(webcastObject, webcastObject.giftDetails)
      delete webcastObject.giftDetails
    }

    if (webcastObject.giftImage) {
      Object.assign(webcastObject, webcastObject.giftImage)
      delete webcastObject.giftImage
    }

    if (webcastObject.giftExtra) {
      Object.assign(webcastObject, webcastObject.giftExtra)
      delete webcastObject.giftExtra

      if (webcastObject.receiverUserId) {
        webcastObject.receiverUserId = webcastObject.receiverUserId.toString()
      }

      if (webcastObject.timestamp) {
        webcastObject.timestamp = parseInt(webcastObject.timestamp)
      }
    }

    if (webcastObject.groupId) {
      webcastObject.groupId = webcastObject.groupId.toString()
    }

    if (
      typeof webcastObject.monitorExtra === 'string' &&
      webcastObject.monitorExtra.indexOf('{') === 0
    ) {
      try {
        webcastObject.monitorExtra = JSON.parse(webcastObject.monitorExtra)
      } catch (err) {
        console.log(err)
      }
    }
  }

  if (webcastObject.emote) {
    webcastObject.emoteId = webcastObject.emote?.emoteId
    webcastObject.emoteImageUrl = webcastObject.emote?.image?.imageUrl
    delete webcastObject.emote
  }

  if (webcastObject.treasureBoxUser) {
    // holy crap
    Object.assign(
      webcastObject,
      getUserAttributes(
        webcastObject.treasureBoxUser?.user2?.user3[0]?.user4?.user || {}
      )
    )
    delete webcastObject.treasureBoxUser
  }

  if (webcastObject.treasureBoxData) {
    Object.assign(webcastObject, webcastObject.treasureBoxData)
    delete webcastObject.treasureBoxData
    webcastObject.timestamp = parseInt(webcastObject.timestamp)
  }

  return Object.assign({}, webcastObject)
}

function getUserAttributes(webcastUser) {
  const userAttributes = {
    userId: webcastUser.userId?.toString(),
    secUid: webcastUser.secUid?.toString(),
    uniqueId: webcastUser.uniqueId !== '' ? webcastUser.uniqueId : undefined,
    nickname: webcastUser.nickname !== '' ? webcastUser.nickname : undefined,
    profilePictureUrl: getPreferredPictureFormat(
      webcastUser.profilePicture?.urls
    ),
    followRole: webcastUser.followInfo?.followStatus,
    userBadges: mapBadges(webcastUser.badges),
    userDetails: {
      createTime: webcastUser.createTime?.toString(),
      bioDescription: webcastUser.bioDescription,
      profilePictureUrls: webcastUser.profilePicture?.urls
    }
  }

  if (webcastUser.followInfo) {
    userAttributes.followInfo = {
      followingCount: webcastUser.followInfo.followingCount,
      followerCount: webcastUser.followInfo.followerCount,
      followStatus: webcastUser.followInfo.followStatus,
      pushStatus: webcastUser.followInfo.pushStatus
    }
  }

  // badgeSceneType:1 = ADMIN
  // badgeSceneType:4 = SUBSCRIBER
  // badgeSceneType:7 = NEWSUBSCRIBER

  userAttributes.isModerator = userAttributes.userBadges.some(
    (x) =>
      (x.type && x.type.toLowerCase().includes('moderator')) ||
      x.badgeSceneType === 1
  )
  userAttributes.isNewGifter = userAttributes.userBadges.some(
    (x) => x.type && x.type.toLowerCase().includes('live_ng_')
  )
  userAttributes.isSubscriber = userAttributes.userBadges.some(
    (x) =>
      (x.url && x.url.toLowerCase().includes('/sub_')) ||
      x.badgeSceneType === 4 ||
      x.badgeSceneType === 7
  )
  userAttributes.topGifterRank =
    userAttributes.userBadges
      .find((x) => x.url && x.url.includes('/ranklist_top_gifter_'))
      ?.url.match(/(?<=ranklist_top_gifter_)(\d+)(?=.png)/g)
      ?.map(Number)[0] ?? null

  return userAttributes
}

function getEventAttributes(event) {
  if (event.msgId) event.msgId = event.msgId.toString()
  if (event.createTime) event.createTime = event.createTime.toString()
  return event
}

function getTopViewerAttributes(topViewers) {
  return topViewers.map((viewer) => {
    return {
      user: viewer.user ? getUserAttributes(viewer.user) : null,
      coinCount: viewer.coinCount ? parseInt(viewer.coinCount) : 0
    }
  })
}

function mapBadges(badges) {
  const simplifiedBadges = []

  if (Array.isArray(badges)) {
    badges.forEach((innerBadges) => {
      const badgeSceneType = innerBadges.badgeSceneType

      if (Array.isArray(innerBadges.badges)) {
        innerBadges.badges.forEach((badge) => {
          simplifiedBadges.push(Object.assign({ badgeSceneType }, badge))
        })
      }

      if (Array.isArray(innerBadges.imageBadges)) {
        innerBadges.imageBadges.forEach((badge) => {
          if (badge && badge.image && badge.image.url) {
            simplifiedBadges.push({
              type: 'image',
              badgeSceneType,
              displayType: badge.displayType,
              url: badge.image.url
            })
          }
        })
      }
    })
  }

  return simplifiedBadges
}

function getPreferredPictureFormat(pictureUrls) {
  if (!pictureUrls || !Array.isArray(pictureUrls) || !pictureUrls.length) {
    return null
  }

  return (
    pictureUrls.find((x) => x.includes('100x100') && x.includes('.webp')) ||
    pictureUrls.find((x) => x.includes('100x100') && x.includes('.jpeg')) ||
    pictureUrls.find((x) => !x.includes('shrink')) ||
    pictureUrls[0]
  )
}

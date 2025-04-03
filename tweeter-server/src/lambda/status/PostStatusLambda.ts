import { PostStatusRequest, StatusDto, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (
  request: PostStatusRequest
): Promise<TweeterResponse> => {
  const statusService = new StatusService();
  const transformedStatus: StatusDto = {
    post: (request.status as any)._post || request.status.post,
    user: {
      firstName:
        (request.status as any)._user?._firstName ||
        (request.status as any)._user?.firstName ||
        request.status.user?.firstName,
      lastName:
        (request.status as any)._user?._lastName ||
        (request.status as any)._user?.lastName ||
        request.status.user?.lastName,
      imageUrl:
        (request.status as any)._user?._imageUrl ||
        (request.status as any)._user?.imageUrl ||
        request.status.user?.imageUrl,

      alias:
        (request.status as any)._user?._alias ||
        (request.status as any)._user?.alias ||
        request.status.user?.alias,
    },
    timestamp: (request.status as any)._timestamp || request.status.timestamp,
    segments: (request.status as any)._segments || request.status.segments,
  };

  await statusService.postStatus(request.token, transformedStatus);

  return {
    success: true,
    message: "Success",
  };
};

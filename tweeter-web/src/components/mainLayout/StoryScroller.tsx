import StatusItemScroller from "./StatusItemScroller";
import { StatusItemView } from "../../presenters/StatusItemPresenter";
import { StoryPresenter } from "../../presenters/StoryPresenter";

const StoryScroller = () => {
  return (
    <StatusItemScroller
      presenterGenerator={(view: StatusItemView) => new StoryPresenter(view)}
    />
  );
};

export default StoryScroller;

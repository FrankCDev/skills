import { Composition, Folder } from "remotion";
import { TechTutorialDemo } from "../skills/reel/layer-4-templates/assets/tech-tutorial-demo";
import { ProductShowcaseDemo } from "../skills/reel/layer-4-templates/assets/product-showcase-demo";
import { DataStoryDemo } from "../skills/reel/layer-4-templates/assets/data-story-demo";
import { SocialShortDemo } from "../skills/reel/layer-4-templates/assets/social-short-demo";

export const RemotionRoot = () => {
  return (
    <>
      <Folder name="Templates">
        <Composition
          id="TechTutorial"
          component={TechTutorialDemo}
          durationInFrames={1800}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ProductShowcase"
          component={ProductShowcaseDemo}
          durationInFrames={1350}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="DataStory"
          component={DataStoryDemo}
          durationInFrames={1350}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="SocialShort"
          component={SocialShortDemo}
          durationInFrames={900}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>
    </>
  );
};

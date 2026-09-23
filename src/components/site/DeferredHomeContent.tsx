import { Amenities } from "./Amenities";
import { BrandStory } from "./BrandStory";
import { Cargo } from "./Cargo";
import { Credentials } from "./Credentials";
import { Faq } from "./Faq";
import { FinalCta } from "./FinalCta";
import { Gallery } from "./Gallery";
import { Offices } from "./Offices";
import { RouteTimeline } from "./RouteTimeline";
import { SonLaStory } from "./SonLaStory";
import { WhyUs } from "./WhyUs";

export default function DeferredHomeContent() {
  return (
    <div className="deferred-home-content">
      <BrandStory />
      <RouteTimeline />
      <SonLaStory />
      <Gallery />
      <Amenities />
      <Cargo />
      <WhyUs />
      <Offices />
      <Credentials />
      <Faq />
      <FinalCta />
    </div>
  );
}

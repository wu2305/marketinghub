/** Demo-only mapping from original fixture paths to bundled image modules.
 * Consumers pass their own URL through the same image props. */
import image0 from "../assets/images/business-explorer-hero.jpg";
import image1 from "../assets/images/business-term-create-hero.webp";
import image2 from "../assets/images/hero-bg-coach.jpg";
import image3 from "../assets/images/knowledge-hero.jpg";
import image4 from "../assets/images/project-abo-tabby.webp";
import image5 from "../assets/images/project-city-tabby.webp";
import image6 from "../assets/images/project-customer-tabby.webp";
import image7 from "../assets/images/project-fourp-tabby.webp";
import image8 from "../assets/images/project-ottolv-tabby.png";
import image9 from "../assets/images/project-rednote-tabby.webp";
import image10 from "../assets/images/tapestry-logo.png";
import image11 from "../assets/images/workspace-business-explorer.png";
import image12 from "../assets/images/workspace-campaign-operations.png";
import image13 from "../assets/images/workspace-knowledge-center.png";
import image14 from "../assets/images/workspace-marketing-overview.png";

const images = {
  "assets/images/business-explorer-hero.jpg": image0,
  "assets/images/business-term-create-hero.png": image1,
  "assets/images/hero-bg-coach.jpg": image2,
  "assets/images/knowledge-hero.jpg": image3,
  "assets/images/project-abo-tabby.png": image4,
  "assets/images/project-city-tabby.png": image5,
  "assets/images/project-customer-tabby.png": image6,
  "assets/images/project-fourp-tabby.png": image7,
  "assets/images/project-ottolv-tabby.png": image8,
  "assets/images/project-rednote-tabby.png": image9,
  "assets/images/tapestry-logo.png": image10,
  "assets/images/workspace-business-explorer.png": image11,
  "assets/images/workspace-campaign-operations.png": image12,
  "assets/images/workspace-knowledge-center.png": image13,
  "assets/images/workspace-marketing-overview.png": image14,
};

export function demoImage(path) {
  return images[path] || path || "";
}

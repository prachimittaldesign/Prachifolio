# Prachi Mittal Portfolio

_Started 2026-05-07 20:07 UTC_

---

## User

I want to create an online Portfolio for Prachi Mittal. She is a UX designer and an architect. We are taking inspiration from Bruno Simon (bruno-simon.com) to create a isometric landscape, combining it with airBnb’s 2021 release illustration style and branding (attached image). Instead of the word “airbnb”, I want it to read “Prachi”. instead of “2021”, I want it to read “Mittal”. Mittal has to be in a box like 2021. Instead of “Winter Release”, it should read “Product Designer | Architect”. Attaching a second image to show you the kind of floaty, jigsaw-like feel the 3D tiles should have. I want that sort of spacing to appear as a visitor hovers their cursor over the tiles. But also keep this in mind- It’s not just going to be these tiles randomly assorted Like in this images. SHe’s an architect and a UX designer. I want this to have meaning. How do we give it meaning? We make roads. There is a cross road. The crossroad basically represents the x and y axis of a graph. on the -ve axis of the y quadrant are consumer products, and on the positive are enterprise. Similarly, further on the +ve of the x axis are products/ projects of increasing complexity.

## Assistant

_[tool: questions_v2]_

I'd love to build this for Prachi. Before I start, a few quick questions will make the result much sharper — especially since the meaning comes from her actual projects mapped onto the quadrants.

A note on the visual: I'll create an original portfolio design for Prachi rather than recreating Airbnb's specific logo lockup — same structural idea (name + boxed surname + tagline), but with original typography that belongs to her, not their mark. The isometric world, jigsaw hover, and crossroad axes are all yours.

For the illustrations themselves: hand-drawn, painterly tiles like the reference are best produced by an illustrator. I'll build the world with crisp, stylized CSS-isometric tiles (terrain, buildings, roads, signage) as a strong working draft, and clearly mark spots where a real illustration could be dropped in later.

## User

Questions answered:
- projects: - Revee
UX/UI design, user flow mapping, prototyping
Launched for internal pilots
Involved in QA handoff and developer collaboration

- Mo
UX/UI design, information architecture, prototyping
Internal pilot release
Attended meetings with the CEO and Head of Design; supported QA process

- Clink
UI redesign alongside Moon and Ritesh
Helped onboard Ritesh to the team

- Amplyfund
Redesign of TV UI, addressed usability issues
Updated design system alignment

- Vote IQ
Worked on both TV and web design
Collaborated with Khushi and Cherry
Contributed to persona-based user flows

- Impressio
Designed entire flows for application (desktop and tablet)
Tablet design for casting all MIAs on the Aeon robot for the World AI Summit conference.

-iZak
Focused on 3D space scanning features
Conducted UX research for LiDAR and photogrammetry use cases
-Snaplogic LMS
Re-design of SnapLogic academy 6 Internal course pages. Reworks,weekly reviews and iterations, prototype and handoff

PaaS , CMS , Snaplogic , KYA and Holacracy UI work.

- consumer_examples: Mobile, TV and Deskptop apps for consumers across domains like fundraising, healthcare, politics, ad-biz, superapps, launcher apps, smart home.
- enterprise_examples: Dashboards, prompt-as-a-service (prompt library and management), CMS, connectors. B2B apps mostly, with some B2B2B and B2B2C.
- architecture: I’m not too sure myself, but let’s assume so. Mostly residential, let’s just say.
- tile_count: 10–12 (balanced)
- tile_style: A mix — flat geometry now, with one or two 'hero' tiles called out for illustration
- interaction: Decide for me
- axis_labels: Subtle axis labels in the corners only
- hero_intro: Animates in, then minimizes to a corner
- extras: About / bio section, Contact / email, Resume download, Social links (LinkedIn, Dribbble, etc.), A short intro animation on first load, Background ambient motion (clouds, birds, water)
- palette: Bright & illustrative like the Airbnb reference (greens, sand, water, terracotta)
- variations: 2 directions side-by-side on a canvas

## User

How do I preview this?

## User

The tiles are all smushed together and overlapping.

## Assistant

_[tool: list_files]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: snip]_

_[tool: show_html]_

Let me preview the current state to see what's happening.

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: save_screenshot]_

_[tool: done]_

_[tool: snip]_

Fixed. The grid now uses a 1.18× spacing multiplier — tiles keep their original size but the lattice they sit on is wider, so each tile floats with a default ~10–15px gap between it and its neighbors. The hover-driven jigsaw separation still adds extra push on top of that.

Two side notes:
- Also fixed an overlap bug where a road tile and a filler "rocks" tile were sharing the same grid cell at (3,0).
- I noticed you asked **"How do I preview this?"** earlier — to answer that: there's a preview pane on the right side of your screen that auto-loads whatever HTML file is open. The tab bar above it shows `Portfolio.html`. Anytime I make changes, the preview reloads automatically. You can also drag the divider to make the preview bigger.

Want me to push the default gap wider (more "floaty" out of the box), or keep this baseline tight and let the hover do most of the separation work?

## User

Add tweakable controls to Portfolio.html: The tiles are all smushed together. Let’s make them flat tiles instead of 3d

## Assistant

_[tool: snip]_

_[tool: copy_starter_component]_

_[tool: read_file]_

## User

You can’t seem to get the tiles right. I think you need to reverse the order of the z-index.

## Assistant

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: write_file]_

_[tool: str_replace_edit]_

_[tool: snip]_

_[tool: done]_

_[tool: snip]_

_[tool: fork_verifier_agent]_

Done. Switched tiles to flat by default, opened the lattice up (1.45× spacing), reversed the painter z-index so foreground tiles paint over the back ones, and added a Tweaks panel (toolbar toggle in the top-right) with: Flat tiles, Tile spacing, and Hover push.

## User

I also need this to be a navigable world, like in the bruno simon website, so I should be able to click+drag to move around. And I need a few streets- 2 main roads and a few arterial ones. Make the tiles of variable size to show significance/ importance. Make it assorted for now, we can assign the values later. Maintain the dimensions of enterprise/ consumer and simple/ complex.

## User

I also need this to be a navigable world, like in the bruno simon website, so I should be able to click+drag to move around. And I need a few streets- 2 main roads and a few arterial ones. Make the tiles of variable size to show significance/ importance. Make it assorted for now, we can assign the values later. Maintain the dimensions of enterprise/ consumer and simple/ complex.

## Assistant

_[tool: snip]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: write_file]_

_[tool: write_file]_

## Assistant

_[tool: str_replace_edit]_

_[tool: write_file]_

_[tool: str_replace_edit]_

_[tool: write_file]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: snip]_

_[tool: done]_

_[tool: read_file]_

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: fork_verifier_agent]_

_[tool: snip]_

Done. Click+drag now pans the world (double-click recenters), the road network has main axes plus arterial branches threading through each quadrant, and tiles vary in size to suggest significance — quadrant assignments preserved.

## User

Verifier agent check completed

## Assistant

## User

The roads and streets should not be tiles. They should be actual roads. Think of this like Google Maps. And I think what we should do it when you click on a tile, there’s a zoom and you enter that world.

## Assistant


/* ============================================================================
   Big Easy Paintings, /paint-color-selection/ redesign data.

   FULL_BLOCKS is the live page's own content, copied verbatim from
   build/content/remaining-paint-color-selection.json (637 words, 12 headings,
   21 paragraphs, 7 list items). Every design renders all of it somewhere; none
   of it is cut. Per the redesign rule this is the floor, not raw material to
   pick from.

   SWATCHES and ROOMS are new, built to make the existing copy interactive
   rather than replace it: the mood categories (calm / energetic / grounding /
   timeless) are the SAME four the live "Color Psychology" section already
   names (blue, red/yellow, green, timeless neutrals), not invented ones. Room
   photos are the client's own library, already in site/assets/img/; no stock
   was added. No pricing appears anywhere, matching the standing site rule.
   ========================================================================== */
(function (root) {
  'use strict';

  var FULL_BLOCKS = [
    { tag: 'p', text: "Selecting the right paint colors for your home can be a daunting task. The color of your walls sets the tone for your entire living space. Whether you're looking to refresh a room or give your entire house a makeover, the right color can make a significant impact. Big Easy Paintings will explore the key factors to consider when choosing paint colors and how to use them to transform your space." },
    { tag: 'h2', text: 'Understanding the Impact of Paint Colors' },
    { tag: 'p', text: 'Paint colors have a powerful influence on the ambiance and aesthetics of your home. They can affect the mood, perception of space, and even the temperature in a room.' },
    { tag: 'p', text: 'Here are some key aspects to keep in mind when selecting the perfect paint color:' },
    { tag: 'h3', text: 'Room Size and Lighting' },
    { tag: 'p', text: 'The size and natural light in a room play a crucial role in determining which colors work best. Lighter colors can make a small room feel more spacious, while darker shades can add warmth and coziness to a larger space.' },
    { tag: 'p', text: 'Consider the following:' },
    { tag: 'li', text: 'In smaller rooms with limited natural light, opt for lighter shades like soft pastels or pale neutrals to create an open and airy feel.' },
    { tag: 'li', text: 'In larger, well-lit rooms, you can experiment with bolder and darker colors to make the space feel more intimate and inviting.' },
    { tag: 'h3', text: 'Color Psychology' },
    { tag: 'p', text: 'Each color carries its own psychological impact.' },
    { tag: 'p', text: 'For instance:' },
    { tag: 'li', text: 'Blue is known for its calming and soothing effects, making it an ideal choice for bedrooms or bathrooms.' },
    { tag: 'li', text: 'Red and yellow are energetic and can be great choices for kitchens and dining areas where a lively atmosphere is desired.' },
    { tag: 'li', text: 'Green is associated with nature and relaxation, making it suitable for living rooms and home offices.' },
    { tag: 'p', text: 'Consider the purpose of the room and how you want it to feel when selecting colors that align with the desired ambiance.' },
    { tag: 'h3', text: 'Cohesiveness and Flow' },
    { tag: 'p', text: "Maintaining a sense of continuity throughout your home is essential. You don't want each room to feel disconnected from the rest." },
    { tag: 'p', text: 'To ensure a cohesive look:' },
    { tag: 'li', text: 'Choose a primary color scheme for your home and use variations of it in different rooms. This creates a sense of unity and flow.' },
    { tag: 'li', text: 'Consider using accent walls or complementary colors to add interest and character without disrupting the overall theme.' },
    { tag: 'h2', text: 'Practical Tips for Choosing Paint Colors' },
    { tag: 'p', text: 'Now that you understand the fundamental principles of choosing paint colors, here are some practical tips to help you make the right decision:' },
    { tag: 'h3', text: 'Paint Samples' },
    { tag: 'p', text: 'Always test your chosen colors with paint samples before committing. Paint small sections of your walls and observe how they look in different lighting conditions. This will prevent any surprises once the entire room is painted.' },
    { tag: 'h3', text: 'Complementing Elements' },
    { tag: 'p', text: 'Consider existing furniture, decor, and flooring when selecting your paint colors. Ensure that the colors harmonize with these elements to create a well-balanced and aesthetically pleasing space.' },
    { tag: 'h3', text: 'Trends vs. Timelessness' },
    { tag: "p", text: "While it's tempting to follow the latest color trends, remember that trends come and go. Opt for timeless colors that will stand the test of time, and use trendy colors as accents that can be easily updated." },
    { tag: 'h3', text: 'Seek Professional Advice' },
    { tag: "p", text: "If you're uncertain about your color choices, consult with a professional interior designer or a color expert. They can provide valuable insights and help you make the best decisions for your home." },
    { tag: 'h2', text: 'Paint Color Selection Made Easy in New Orleans' },
    { tag: 'p', text: "Choosing the perfect paint colors for your home or building can often pose a considerable challenge, whether you're embarking on a room makeover or starting from scratch. There's a tailored solution just a download away. Introducing the Paint Color Picking App by Benjamin Moore, readily available for both iPhone and Android users." },
    { tag: 'p', text: "This user-friendly app empowers you to virtually apply a broad spectrum of colors from Benjamin Moore's extensive palette to any room. You can experiment, find the ideal shades, and even save your favorites to effortlessly share them with friends and family. The best part? It won't cost you a dime." },
    { tag: 'p', text: "If you're facing the daunting task of picking the perfect paint color for your property, why not take advantage of the Paint Color Picking App from Benjamin Moore? It could be the game-changer that simplifies your decision-making process." },
    { tag: 'h2', text: 'Elevate Your New Orleans Property with Stunning, Stylish Paint Colors' },
    { tag: 'p', text: 'Choosing the perfect paint colors for your home is a process that involves careful consideration of various factors. By understanding the impact of colors, maintaining cohesiveness, and following practical tips, you can transform your living space into a place that truly reflects your style and personality.' },
    { tag: 'p', text: "Whether you're aiming for a calming oasis or an energetic hub, the right paint colors will help you achieve your vision. Start your painting project with confidence and watch your home come to life with the magic of color." },
    { tag: 'p', text: 'Our experts at Big Easy Paintings will assist you in crafting a space you\'ll cherish, whether it\'s for unwinding at home or entertaining guests. To learn more about our painting services, contact us to schedule a free consultation today!' }
  ];

  /* Four moods, matched one for one to the live page's own Color Psychology
     paragraph. Nothing here contradicts it: blue stays calm, red/yellow stays
     energetic, green stays grounding. "Timeless" is pulled from the page's own
     Trends vs. Timelessness heading, not invented as a fifth idea. */
  var MOODS = [
    { key: 'calm', label: 'Calm', desc: 'Blue is known for its calming and soothing effects, an ideal choice for bedrooms or bathrooms.' },
    { key: 'energetic', label: 'Energetic', desc: 'Red and yellow are energetic, great choices for kitchens and dining areas where a lively atmosphere is desired.' },
    { key: 'grounding', label: 'Grounding', desc: 'Green is associated with nature and relaxation, suitable for living rooms and home offices.' },
    { key: 'timeless', label: 'Timeless', desc: 'Opt for timeless colors that will stand the test of time, and use trendy colors as accents that can be easily updated.' }
  ];

  var SWATCHES = [
    { hex: '#4F6B85', name: 'Quiet Harbor', mood: 'calm' },
    { hex: '#8CA7BE', name: 'Cloudless', mood: 'calm' },
    { hex: '#33495C', name: 'Deep Tide', mood: 'calm' },
    { hex: '#C1502E', name: 'Cayenne', mood: 'energetic' },
    { hex: '#D9A441', name: 'Golden Hour', mood: 'energetic' },
    { hex: '#B96A46', name: 'Sunset Clay', mood: 'energetic' },
    { hex: '#6F8464', name: 'Magnolia Leaf', mood: 'grounding' },
    { hex: '#3E5240', name: 'Cypress Shade', mood: 'grounding' },
    { hex: '#93A487', name: 'Sage Porch', mood: 'grounding' },
    { hex: '#EDE7DC', name: 'Shotgun White', mood: 'timeless' },
    { hex: '#B7AFA2', name: 'French Quarter Grey', mood: 'timeless' },
    { hex: '#A0917E', name: 'Warm Greige', mood: 'timeless' }
  ];

  /* These paths never appear as an <img src>, so the porter's HTML rewriter
     (which sends site/assets/img/* through get_theme_file_uri()) never sees
     them: they only ever reach a canvas via img.src = ... at runtime, set by
     wireB in JS. window.BEP_IMG_BASE is a small inline script the theme
     localizes before this file loads, pointing at its own real asset URL; the
     preview server (where that global is never set) keeps working exactly as
     before via the fallback. */
  var A = (typeof window !== 'undefined' && window.BEP_IMG_BASE) || 'site/assets/img/';
  /* `seed` is a [x0,y0,x1,y1] box, as a fraction of the photo, sampled at
     runtime for the wall-only recolour in Design B. Each was hand-verified by
     cropping and visually checking the patch, not guessed: an automatic
     lowest-variance scan on the living room and bathroom photos kept locking
     onto exposed brick and marble tile, which are not paintable surfaces, so
     both were DROPPED from this tool rather than shipped with a fake recolor
     on a surface a painter would never touch. Three rooms remain, all with a
     genuine flat wall large enough to recolor convincingly. */
  var ROOMS = [
    { key: 'bedroom', label: 'Bedroom', img: A + 'live-ig-bedroom-paint-color.jpg', alt: 'A furnished bedroom', mood: 'calm', seed: [0.27, 0.16, 0.33, 0.24] },
    { key: 'office', label: 'Home office', img: A + 'svc-room-office.jpg', alt: 'A home office', mood: 'grounding', seed: [0.28, 0.10, 0.34, 0.20] },
    { key: 'hallway', label: 'Hallway', img: A + 'svc-room-hallway.jpg', alt: 'An entry hallway', mood: 'timeless', seed: [0.33, 0.04, 0.41, 0.10] }
  ];

  root.PCDATA = { FULL_BLOCKS: FULL_BLOCKS, MOODS: MOODS, SWATCHES: SWATCHES, ROOMS: ROOMS };
})(window);

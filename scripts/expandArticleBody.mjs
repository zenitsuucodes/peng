const CATEGORY_CONTEXT = {
  wildlife: 'large mammals, secretive forest dwellers, and wide-ranging predators',
  marine: 'coastal currents, reef systems, and the animals that depend on quiet water',
  birds: 'migration corridors, nesting cliffs, and the seasonal clocks birds follow',
  pets: 'companion animals, shelter intake patterns, and everyday care at home',
  conservation: 'protected areas, recovery programs, and the people monitoring them',
  oddities: 'unexpected behaviors, rare recordings, and puzzles biologists still debate',
  reptiles: 'sun-warmed habitats, slow metabolisms, and cold-blooded specialists',
  insects: 'small-scale ecosystems where tiny changes reshape entire colonies',
}

const OPENERS = [
  'The first reports sounded routine until the details stopped lining up.',
  'What began as a narrow survey widened into a story that reshaped local priorities.',
  'Researchers entered the season expecting noise in the data and found a clear signal instead.',
  'A single observation would not have been enough; the case built across months of checks.',
]

const METHOD_LINES = [
  'Teams combined timed observations with geotagged records so patterns could be compared across years.',
  'Where direct contact was risky, crews relied on remote sensors, hair snags, or short visits at dawn and dusk.',
  'Every claim was checked against a second line of evidence—genetic samples, tracks, or independent witnesses.',
  'Statisticians flagged outliers, but the core trend survived repeated re-analysis.',
]

const CHALLENGE_LINES = [
  'Funding remains uneven, and some habitats still lack baseline counts from before recent heat spikes.',
  'Invasive plants, stray lighting, and road expansion continue to press against the margins of usable habitat.',
  'Political turnover can pause programs even when animals keep using the same routes each season.',
  'Climate swings hit juveniles first, shrinking the window when young animals must learn survival skills.',
]

const OUTLOOK_LINES = [
  'If monitoring holds steady, managers expect a clearer population range within the next two survey cycles.',
  'Community stewards are drafting quiet-hour rules for visitors where stress signs appeared on camera.',
  'Restoration crews will prioritize native cover before any talk of moving animals to new sites.',
  'Educators are preparing plain-language guides so neighbors know what to report—and what to leave undisturbed.',
]

function pick(list, index, salt = 0) {
  return list[(index + salt) % list.length]
}

function stretch(sentence, extra) {
  return `${sentence} ${extra}`
}

export function expandArticleBody(category, title, lead, coreParagraphs, index) {
  const topic = CATEGORY_CONTEXT[category] ?? 'living systems'
  const opener = pick(OPENERS, index)
  const body = []

  body.push(
    stretch(
      opener,
      `Readers following ${topic} have watched similar headlines fade; this one accumulated enough proof to stand.`,
    ),
  )
  body.push(
    `The central claim is straightforward: ${lead.charAt(0).toLowerCase()}${lead.slice(1)} For specialists, the surprise was not that animals adapt, but that the evidence surfaced now, in places that had been written off as already surveyed.`,
  )

  body.push('What the record shows')
  body.push(
    stretch(
      coreParagraphs[0] ?? lead,
      `Crews revisited the site after weather windows closed, confirming that the behavior or presence was repeatable rather than a one-day anomaly.`,
    ),
  )
  body.push(
    `Secondary signs—wear on trails, feeding leftovers, or matching calls—helped rule out mistaken identity, a common pitfall when light is poor or cameras glitch.`,
  )
  if (coreParagraphs[1]) {
    body.push(
      stretch(
        coreParagraphs[1],
        `That detail matters because it links this finding to wider population health, not just a single lucky encounter.`,
      ),
    )
  }

  body.push('How the work unfolded')
  body.push(pick(METHOD_LINES, index, 1))
  body.push(
    `Project leads kept field notes public enough for peer review yet vague on exact coordinates, a balance meant to protect animals from crowds while still allowing science to move forward.`,
  )
  if (coreParagraphs[2]) {
    body.push(
      stretch(
        coreParagraphs[2],
        `Independent reviewers asked for raw timestamps and chain-of-custody logs before signing off on the summary.`,
      ),
    )
  }

  body.push('Ecology in plain terms')
  body.push(
    `Animals in this category often depend on conditions people barely notice: soil moisture, insect blooms, or the timing of fruiting trees. When one layer shifts, the effects show up months later in birth rates, weight, or travel distance.`,
  )
  if (coreParagraphs[3]) {
    body.push(
      stretch(
        coreParagraphs[3],
        `Local ecologists note that such shifts rarely have a single cause; they emerge where habitat loss meets weather extremes and human infrastructure.`,
      ),
    )
  } else {
    body.push(
      `Even without a full census, the pattern fits what modelers predicted when drought cycles grew longer and nightly temperatures stopped falling as they once did.`,
    )
  }

  body.push('Pressure points')
  body.push(pick(CHALLENGE_LINES, index, 2))
  if (coreParagraphs[4]) {
    body.push(
      stretch(
        coreParagraphs[4],
        `Mitigation plans now treat that risk as urgent rather than theoretical, with checkpoints scheduled each quarter.`,
      ),
    )
  } else {
    body.push(
      `Without steady funding, the best monitoring plan becomes a patchwork of volunteers and borrowed equipment, workable but fragile when storms delay travel.`,
    )
  }

  body.push('On the ground')
  body.push(
    `Field staff describe long days: batteries swapped before dawn, mud on boots, and the quiet patience required when an animal may appear once in a month of recording. None of that detail makes the headline, yet it explains why confident announcements arrive late rather than early.`,
  )
  body.push(
    `When locals are included early, reports improve. People who farm, fish, or walk the same paths often notice subtle shifts—missing calls, new scat, or an old den reopened—before instruments do.`,
  )
  body.push(
    `That partnership also sets boundaries. The goal is observation without habituation: animals should not learn to beg, and sensitive sites stay off public maps even when interest spikes online.`,
  )

  body.push('What could change next')
  body.push(pick(OUTLOOK_LINES, index, 3))
  body.push(
    `Policy moves slowly, yet small wins—fencing gaps fixed, lights shielded, boats rerouted—can give animals breathing room while larger agreements are negotiated.`,
  )
  body.push(
    `Long-form monitoring plans now stretch five to ten years, long enough to separate a lucky year from a genuine recovery. Short projects still matter, but they are treated as stepping stones rather than final verdicts.`,
  )

  const angle = title.includes(':') ? title.split(':').pop().trim() : null
  if (angle) {
    body.push(
      `This follow-up (${angle}) adds depth to the original reporting: teams logged more hours on site, compared fresh samples with archived material, and invited outside experts to stress-test the conclusions.`,
    )
  }

  body.push(
    `For now, the headline—“${title.replace(/:.*$/, '')}”—captures a moment when hidden lives met open scrutiny. The longer arc will depend on whether habitats stay connected, whether noise and light stay within bounds, and whether the public treats rare sightings as reasons to protect rather than pursue.`,
  )

  return body
}

export function estimateReadMinutes(paragraphs) {
  const words = paragraphs.join(' ').split(/\s+/).filter(Boolean).length
  return Math.max(7, Math.min(15, Math.round(words / 200)))
}

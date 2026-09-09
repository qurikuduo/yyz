// BDI-II (Beck Depression Inventory-II) — Beck, Steer & Brown, 1996.
// COPYRIGHT: BDI-II is a proprietary instrument of Pearson Education / The Psychological
// Corporation. This is a clinically faithful self-rating representation included per project
// decision for PERSONAL / EDUCATIONAL screening use only, NOT for clinical diagnosis,
// redistribution, or commercial use. See docs/DISCLAIMER.md.
// 21 items, each with four unique statements scored 0-3. Timeframe: past two weeks
// including today. Bands: 0-13 minimal, 14-19 mild, 20-28 moderate, 29-63 severe.
// Item 9 (Suicidal Thoughts or Desires) is the crisis item.

const items = [
  {
    id: 'bdii-1', domain: { zh: '悲伤', en: 'Sadness' }, dsm5: 'A1',
    text: { zh: '悲伤', en: 'Sadness' },
    options: [
      { value: 0, label: { zh: '我不感到悲伤', en: 'I do not feel sad' }, meaning: { zh: '无悲伤情绪。', en: 'No sadness.' } },
      { value: 1, label: { zh: '我常常感到悲伤', en: 'I feel sad much of the time' }, meaning: { zh: '经常感到悲伤。', en: 'Sad much of the time.' } },
      { value: 2, label: { zh: '我一直感到悲伤，无法摆脱', en: 'I am sad all the time and cannot snap out of it' }, meaning: { zh: '持续悲伤且无法摆脱。', en: 'Sad all the time, unable to snap out.' } },
      { value: 3, label: { zh: '我悲伤得难以忍受', en: 'I am so sad or unhappy that I cannot stand it' }, meaning: { zh: '悲伤到难以忍受。', en: 'Sadness is unbearable.' } }
    ],
    explanation: { zh: '测量抑郁的核心情绪——悲伤的强度与持续性，对应 DSM-5 心境低落标准。', en: 'Measures the intensity/persistence of sadness, the core depressive affect; maps to the DSM-5 depressed-mood criterion.' }
  },
  {
    id: 'bdii-2', domain: { zh: '悲观', en: 'Pessimism' },
    text: { zh: '悲观', en: 'Pessimism' },
    options: [
      { value: 0, label: { zh: '我对未来并不特别悲观', en: 'I am not particularly pessimistic about the future' }, meaning: { zh: '对未来无特别悲观。', en: 'Not particularly pessimistic.' } },
      { value: 1, label: { zh: '我觉得未来没有什么可指望的', en: 'I feel there is nothing to look forward to' }, meaning: { zh: '对未来缺乏期待。', en: 'Nothing to look forward to.' } },
      { value: 2, label: { zh: '我觉得未来不会有好事', en: 'I feel the future holds nothing good for me' }, meaning: { zh: '预期未来无好事。', en: 'Expects nothing good ahead.' } },
      { value: 3, label: { zh: '我觉得未来毫无希望，只会更糟', en: 'I feel the future is hopeless and will only get worse' }, meaning: { zh: '强烈绝望感。', en: 'Strong hopelessness.' } }
    ],
    explanation: { zh: '测量对未来的悲观/绝望，是抑郁的重要认知特征，也与自杀风险相关。', en: 'Measures pessimism/hopelessness about the future, a key cognitive feature of depression and associated with suicide risk.' }
  },
  {
    id: 'bdii-3', domain: { zh: '过往失败', en: 'Past Failure' }, dsm5: 'A7',
    text: { zh: '过往失败', en: 'Past Failure' },
    options: [
      { value: 0, label: { zh: '我不觉得自己是个失败者', en: 'I do not feel like a failure' }, meaning: { zh: '无失败感。', en: 'No sense of failure.' } },
      { value: 1, label: { zh: '我觉得自己比一般人失败得多', en: 'I feel I have failed more than the average person' }, meaning: { zh: '自觉比常人更多失败。', en: 'Feels more failed than average.' } },
      { value: 2, label: { zh: '回顾过去，我只看到许多失败', en: 'As I look back, I see a lot of failures' }, meaning: { zh: '回顾满是失败。', en: 'Past seen as many failures.' } },
      { value: 3, label: { zh: '我觉得自己作为一个人是彻底的失败', en: 'I feel I am a total failure as a person' }, meaning: { zh: '感到彻底失败。', en: 'Feels a total failure.' } }
    ],
    explanation: { zh: '测量对过往的失败感与自我否定，对应 DSM-5 无价值感/过度自责标准。', en: 'Measures feelings of past failure and self-negation; maps to the DSM-5 worthlessness/excessive-guilt criterion.' }
  },
  {
    id: 'bdii-4', domain: { zh: '快感缺失', en: 'Loss of Pleasure' }, dsm5: 'A2',
    text: { zh: '失去乐趣', en: 'Loss of Pleasure' },
    options: [
      { value: 0, label: { zh: '我从以往喜欢的事中仍获得同样的满足', en: 'I get as much satisfaction out of things as I used to' }, meaning: { zh: '愉悦感如常。', en: 'Pleasure unchanged.' } },
      { value: 1, label: { zh: '我不像以前那样能从事情中获得享受', en: 'I do not enjoy things as much as I used to' }, meaning: { zh: '享受感下降。', en: 'Reduced enjoyment.' } },
      { value: 2, label: { zh: '我从任何事情中都得不到真正的满足', en: 'I get no real satisfaction out of anything anymore' }, meaning: { zh: '几乎无满足感。', en: 'Little real satisfaction.' } },
      { value: 3, label: { zh: '我对一切都感到不满、厌烦', en: 'I am dissatisfied with or bored by everything' }, meaning: { zh: '对一切不满/厌烦。', en: 'Dissatisfied/bored with everything.' } }
    ],
    explanation: { zh: '测量快感缺失，是抑郁两大核心症状之一，对应 DSM-5 兴趣/愉悦减退标准。', en: 'Measures anhedonia, one of the two core depressive symptoms; maps to the DSM-5 diminished-interest/pleasure criterion.' }
  },
  {
    id: 'bdii-5', domain: { zh: '内疚感', en: 'Guilty Feelings' }, dsm5: 'A7',
    text: { zh: '内疚感', en: 'Guilty Feelings' },
    options: [
      { value: 0, label: { zh: '我不特别感到内疚', en: 'I do not feel particularly guilty' }, meaning: { zh: '无明显内疚。', en: 'No particular guilt.' } },
      { value: 1, label: { zh: '我不少时候感到内疚', en: 'I feel guilty a good part of the time' }, meaning: { zh: '经常内疚。', en: 'Guilty a good part of the time.' } },
      { value: 2, label: { zh: '我大部分时间感到内疚', en: 'I feel guilty most of the time' }, meaning: { zh: '大部分时间内疚。', en: 'Guilty most of the time.' } },
      { value: 3, label: { zh: '我一直感到内疚', en: 'I feel guilty all the time' }, meaning: { zh: '持续内疚。', en: 'Guilty all the time.' } }
    ],
    explanation: { zh: '测量过度/不恰当的内疚感，对应 DSM-5 无价值感/自责标准。', en: 'Measures excessive/inappropriate guilt; maps to the DSM-5 worthlessness/self-blame criterion.' }
  },
  {
    id: 'bdii-6', domain: { zh: '受罚感', en: 'Punishment Feelings' },
    text: { zh: '受罚感', en: 'Punishment Feelings' },
    options: [
      { value: 0, label: { zh: '我觉得自己并没有受到惩罚', en: 'I do not feel I am being punished' }, meaning: { zh: '无受罚感。', en: 'No sense of punishment.' } },
      { value: 1, label: { zh: '我觉得自己可能会受到惩罚', en: 'I feel I may be punished' }, meaning: { zh: '担心可能受罚。', en: 'Fears possible punishment.' } },
      { value: 2, label: { zh: '我觉得自己正受到惩罚', en: 'I feel I am being punished' }, meaning: { zh: '感到正被惩罚。', en: 'Feels currently punished.' } },
      { value: 3, label: { zh: '我觉得自己应该受到惩罚', en: 'I feel I deserve to be punished' }, meaning: { zh: '觉得自己该受罚。', en: 'Feels deserving of punishment.' } }
    ],
    explanation: { zh: '测量受罚/罪有应得的感受，反映抑郁中的病理性自责。', en: 'Measures feelings of being punished/deserving punishment, reflecting pathological self-blame in depression.' }
  },
  {
    id: 'bdii-7', domain: { zh: '自我厌恶', en: 'Self-Dislike' }, dsm5: 'A7',
    text: { zh: '自我厌恶', en: 'Self-Dislike' },
    options: [
      { value: 0, label: { zh: '我对自己感到满意', en: 'I feel the same about myself as ever' }, meaning: { zh: '自我感受如常。', en: 'Self-view unchanged.' } },
      { value: 1, label: { zh: '我对自己失去了信心', en: 'I have lost confidence in myself' }, meaning: { zh: '自信下降。', en: 'Lost confidence.' } },
      { value: 2, label: { zh: '我对自己感到失望', en: 'I am disappointed in myself' }, meaning: { zh: '对自己失望。', en: 'Disappointed in self.' } },
      { value: 3, label: { zh: '我厌恶自己', en: 'I dislike myself' }, meaning: { zh: '厌恶自己。', en: 'Self-dislike.' } }
    ],
    explanation: { zh: '测量自我厌恶/自信丧失，对应 DSM-5 无价值感标准的认知维度。', en: 'Measures self-dislike/loss of confidence, the cognitive dimension of the DSM-5 worthlessness criterion.' }
  },
  {
    id: 'bdii-8', domain: { zh: '自我批评', en: 'Self-Criticalness' }, dsm5: 'A7',
    text: { zh: '自我批评', en: 'Self-Criticalness' },
    options: [
      { value: 0, label: { zh: '我不比以往更批评自己', en: 'I do not criticize myself more than usual' }, meaning: { zh: '自我批评如常。', en: 'Self-criticism unchanged.' } },
      { value: 1, label: { zh: '我比以前更批评自己', en: 'I am more critical of myself than I used to be' }, meaning: { zh: '自我批评增多。', en: 'More self-critical.' } },
      { value: 2, label: { zh: '我为自己所有的缺点批评自己', en: 'I criticize myself for all of my faults' }, meaning: { zh: '因所有缺点自责。', en: 'Criticizes all faults.' } },
      { value: 3, label: { zh: '我为自己所有的过错责备自己', en: 'I blame myself for everything bad that happens' }, meaning: { zh: '为一切坏事自责。', en: 'Blames self for everything.' } }
    ],
    explanation: { zh: '测量过度自我批评，反映抑郁的负性自我图式。', en: 'Measures excessive self-criticism, reflecting depression\'s negative self-schema.' }
  },
  {
    id: 'bdii-9', domain: { zh: '自杀意念', en: 'Suicidal Thoughts or Desires' }, dsm5: 'A10', crisis: true,
    text: { zh: '自杀念头或欲望', en: 'Suicidal Thoughts or Desires' },
    options: [
      { value: 0, label: { zh: '我没有任何自杀的念头', en: 'I have no thoughts of killing myself' }, meaning: { zh: '无自杀念头。', en: 'No suicidal thoughts.' } },
      { value: 1, label: { zh: '我有自杀的念头，但不会付诸行动', en: 'I have thoughts of killing myself but would not carry them out' }, meaning: { zh: '有念头但不行动。', en: 'Thoughts but no intent to act.' } },
      { value: 2, label: { zh: '我想杀死自己', en: 'I would like to kill myself' }, meaning: { zh: '有自杀意愿。', en: 'Wishes to die.' } },
      { value: 3, label: { zh: '如果有机会，我会杀死自己', en: 'I would kill myself if I had the chance' }, meaning: { zh: '有条件即会自杀，高危。', en: 'Would act given the chance — high risk.' } }
    ],
    explanation: { zh: '安全性关键条目：测量自杀意念/欲望。任何非零选项（≥1）都会触发危机干预提示，无论总分高低——这是最高优先级。', en: 'Critical safety item: measures suicidal thoughts/desires. Any non-zero option (>=1) triggers crisis guidance regardless of total score — the highest priority.' }
  },
  {
    id: 'bdii-10', domain: { zh: '哭泣', en: 'Crying' },
    text: { zh: '哭泣', en: 'Crying' },
    options: [
      { value: 0, label: { zh: '我哭泣不比平时多', en: 'I do not cry more than I used to' }, meaning: { zh: '哭泣如常。', en: 'Crying unchanged.' } },
      { value: 1, label: { zh: '我比以前更爱哭', en: 'I cry more than I used to' }, meaning: { zh: '哭泣增多。', en: 'Cries more.' } },
      { value: 2, label: { zh: '我现在为很小的事就哭', en: 'I now cry over very little things' }, meaning: { zh: '因小事哭泣。', en: 'Cries over little things.' } },
      { value: 3, label: { zh: '我最近常哭，却哭不出来', en: 'I feel like crying but cannot' }, meaning: { zh: '想哭却哭不出。', en: 'Feels like crying but cannot.' } }
    ],
    explanation: { zh: '测量哭泣倾向，反映悲伤的情绪表达。', en: 'Measures crying tendency, an expression of sadness.' }
  },
  {
    id: 'bdii-11', domain: { zh: '激越', en: 'Agitation' }, dsm5: 'A9',
    text: { zh: '激越', en: 'Agitation' },
    options: [
      { value: 0, label: { zh: '我不比平时更烦躁或紧张', en: 'I am no more restless or wound up than usual' }, meaning: { zh: '无激越。', en: 'No agitation.' } },
      { value: 1, label: { zh: '我比平时更容易烦躁或紧张', en: 'I am more restless or wound up than usual' }, meaning: { zh: '轻度激越。', en: 'Mildly more restless.' } },
      { value: 2, label: { zh: '我烦躁得难以安静地坐着', en: 'I am so restless or agitated that it is hard to sit still' }, meaning: { zh: '难以静坐。', en: 'Hard to sit still.' } },
      { value: 3, label: { zh: '我烦躁得必须一直走动或做事', en: 'I am so restless or agitated that I have to keep moving or doing something' }, meaning: { zh: '必须不停活动。', en: 'Must keep moving.' } }
    ],
    explanation: { zh: '测量精神运动性激越，对应 DSM-5 精神运动性改变标准。', en: 'Measures psychomotor agitation; maps to the DSM-5 psychomotor-change criterion.' }
  },
  {
    id: 'bdii-12', domain: { zh: '兴趣丧失', en: 'Loss of Interest' }, dsm5: 'A2',
    text: { zh: '兴趣丧失', en: 'Loss of Interest' },
    options: [
      { value: 0, label: { zh: '我对事情的兴趣没有减退', en: 'I have not lost interest in other people or activities' }, meaning: { zh: '兴趣如常。', en: 'Interest unchanged.' } },
      { value: 1, label: { zh: '我对人或事的兴趣比以前减退', en: 'I am less interested in other people or things than before' }, meaning: { zh: '兴趣减退。', en: 'Less interested.' } },
      { value: 2, label: { zh: '我对人或事几乎失去全部兴趣', en: 'I have lost most of my interest in other people or things' }, meaning: { zh: '兴趣大部丧失。', en: 'Lost most interest.' } },
      { value: 3, label: { zh: '我对任何事、任何人都提不起兴趣', en: 'It is hard to get interested in anything' }, meaning: { zh: '全面兴趣丧失。', en: 'Interest lost in everything.' } }
    ],
    explanation: { zh: '测量兴趣丧失，是抑郁核心症状之一，对应 DSM-5 兴趣减退标准。', en: 'Measures loss of interest, a core symptom; maps to the DSM-5 diminished-interest criterion.' }
  },
  {
    id: 'bdii-13', domain: { zh: '犹豫不决', en: 'Indecisiveness' }, dsm5: 'A8',
    text: { zh: '犹豫不决', en: 'Indecisiveness' },
    options: [
      { value: 0, label: { zh: '我做决定和以往一样好', en: 'I make decisions about as well as ever' }, meaning: { zh: '决策如常。', en: 'Decisions unchanged.' } },
      { value: 1, label: { zh: '我把做决定推迟得比以前多', en: 'I put off making decisions more than I used to' }, meaning: { zh: '推迟决策。', en: 'Postpones decisions.' } },
      { value: 2, label: { zh: '我做决定比以前困难得多', en: 'I have much greater difficulty making decisions than before' }, meaning: { zh: '决策困难。', en: 'Difficulty deciding.' } },
      { value: 3, label: { zh: '我连最简单的决定也做不了', en: 'I have trouble making any decisions' }, meaning: { zh: '无法决策。', en: 'Cannot make decisions.' } }
    ],
    explanation: { zh: '测量犹豫不决，对应 DSM-5 思维/决策能力减退标准。', en: 'Measures indecisiveness; maps to the DSM-5 diminished-thinking/decisiveness criterion.' }
  },
  {
    id: 'bdii-14', domain: { zh: '无价值感', en: 'Worthlessness' }, dsm5: 'A7',
    text: { zh: '无价值感', en: 'Worthlessness' },
    options: [
      { value: 0, label: { zh: '我不觉得自己没有价值', en: 'I do not feel I am worthless' }, meaning: { zh: '无无价值感。', en: 'No worthlessness.' } },
      { value: 1, label: { zh: '我不像以往那样觉得自己有价值', en: 'I do not consider myself as worthwhile and useful as I used to' }, meaning: { zh: '自觉价值下降。', en: 'Feels less worthwhile.' } },
      { value: 2, label: { zh: '我觉得自己比别人更没有价值', en: 'I feel more worthless as compared to other people' }, meaning: { zh: '自觉不如人。', en: 'Feels more worthless than others.' } },
      { value: 3, label: { zh: '我觉得自己毫无价值', en: 'I feel utterly worthless' }, meaning: { zh: '感到毫无价值。', en: 'Feels utterly worthless.' } }
    ],
    explanation: { zh: '测量无价值感，直接对应 DSM-5 无价值感标准。', en: 'Measures worthlessness, directly mapping to the DSM-5 worthlessness criterion.' }
  },
  {
    id: 'bdii-15', domain: { zh: '精力丧失', en: 'Loss of Energy' }, dsm5: 'A6',
    text: { zh: '精力丧失', en: 'Loss of Energy' },
    options: [
      { value: 0, label: { zh: '我的精力和以往一样', en: 'I have as much energy as ever' }, meaning: { zh: '精力如常。', en: 'Energy unchanged.' } },
      { value: 1, label: { zh: '我的精力比以前少', en: 'I have less energy than I used to have' }, meaning: { zh: '精力下降。', en: 'Less energy.' } },
      { value: 2, label: { zh: '我没有精力做大多数事情', en: 'I do not have enough energy to do very much' }, meaning: { zh: '精力不足以做事。', en: 'Not enough energy.' } },
      { value: 3, label: { zh: '我精力缺乏到什么都做不了', en: 'I do not have enough energy to do anything' }, meaning: { zh: '几乎无精力。', en: 'Energy to do nothing.' } }
    ],
    explanation: { zh: '测量精力丧失，对应 DSM-5 疲劳/精力丧失标准。', en: 'Measures loss of energy; maps to the DSM-5 fatigue/energy-loss criterion.' }
  },
  {
    id: 'bdii-16', domain: { zh: '睡眠改变', en: 'Changes in Sleeping Pattern' }, dsm5: 'A4',
    text: { zh: '睡眠模式改变', en: 'Changes in Sleeping Pattern' },
    options: [
      { value: 0, label: { zh: '我的睡眠和以往一样', en: 'I have not experienced any change in my sleeping pattern' }, meaning: { zh: '睡眠如常。', en: 'Sleep unchanged.' } },
      { value: 1, label: { zh: '我睡得比平时略多或略少', en: 'I sleep somewhat more or somewhat less than usual' }, meaning: { zh: '睡眠略多/略少。', en: 'Slightly more/less sleep.' } },
      { value: 2, label: { zh: '我睡得比平时明显多或明显少', en: 'I sleep a lot more or a lot less than usual' }, meaning: { zh: '睡眠明显改变。', en: 'Markedly changed sleep.' } },
      { value: 3, label: { zh: '我几乎整夜睡不着，或大部分时间在睡', en: 'I sleep most of the day or wake 1-2 hours early and cannot get back to sleep' }, meaning: { zh: '严重失眠或嗜睡。', en: 'Severe insomnia or hypersomnia.' } }
    ],
    explanation: { zh: '测量睡眠模式改变（失眠或嗜睡），对应 DSM-5 睡眠紊乱标准。', en: 'Measures sleep-pattern change (insomnia or hypersomnia); maps to the DSM-5 sleep-disturbance criterion.' }
  },
  {
    id: 'bdii-17', domain: { zh: '易激惹', en: 'Irritability' },
    text: { zh: '易激惹', en: 'Irritability' },
    options: [
      { value: 0, label: { zh: '我不比平时更容易恼怒', en: 'I am no more irritable than usual' }, meaning: { zh: '无易激惹。', en: 'No irritability.' } },
      { value: 1, label: { zh: '我比平时更容易恼怒', en: 'I am more irritable than usual' }, meaning: { zh: '易怒增多。', en: 'More irritable.' } },
      { value: 2, label: { zh: '我比平时恼怒得多', en: 'I am much more irritable than usual' }, meaning: { zh: '明显易怒。', en: 'Much more irritable.' } },
      { value: 3, label: { zh: '我一直感到恼怒', en: 'I am irritable all the time' }, meaning: { zh: '持续恼怒。', en: 'Irritable all the time.' } }
    ],
    explanation: { zh: '测量易激惹，抑郁常见的情绪症状，尤其在男性与青少年中突出。', en: 'Measures irritability, common in depression and especially prominent in men and adolescents.' }
  },
  {
    id: 'bdii-18', domain: { zh: '食欲改变', en: 'Changes in Appetite' }, dsm5: 'A5',
    text: { zh: '食欲改变', en: 'Changes in Appetite' },
    options: [
      { value: 0, label: { zh: '我的食欲和以往一样', en: 'My appetite has not changed' }, meaning: { zh: '食欲如常。', en: 'Appetite unchanged.' } },
      { value: 1, label: { zh: '我的食欲比平时略差或略好', en: 'My appetite is somewhat less or somewhat greater than usual' }, meaning: { zh: '食欲略改变。', en: 'Slightly changed appetite.' } },
      { value: 2, label: { zh: '我的食欲比平时明显差或明显好', en: 'My appetite is a lot less or a lot greater than usual' }, meaning: { zh: '食欲明显改变。', en: 'Markedly changed appetite.' } },
      { value: 3, label: { zh: '我完全没有食欲，或一直极度想吃东西', en: 'I either have no appetite at all or crave food all the time' }, meaning: { zh: '食欲严重改变。', en: 'Severely changed appetite.' } }
    ],
    explanation: { zh: '测量食欲改变（增加或减少），对应 DSM-5 食欲/体重改变标准。', en: 'Measures appetite change (increase or decrease); maps to the DSM-5 appetite/weight criterion.' }
  },
  {
    id: 'bdii-19', domain: { zh: '注意力困难', en: 'Concentration Difficulty' }, dsm5: 'A8',
    text: { zh: '注意力困难', en: 'Concentration Difficulty' },
    options: [
      { value: 0, label: { zh: '我能像以往一样集中注意力', en: 'I can concentrate as well as ever' }, meaning: { zh: '注意力如常。', en: 'Concentration unchanged.' } },
      { value: 1, label: { zh: '我不能像以往那样集中注意力', en: 'I cannot concentrate as well as usual' }, meaning: { zh: '注意力下降。', en: 'Reduced concentration.' } },
      { value: 2, label: { zh: '我难以长时间集中注意力', en: 'It is hard to keep my mind on anything for very long' }, meaning: { zh: '难以持续专注。', en: 'Hard to sustain focus.' } },
      { value: 3, label: { zh: '我无法集中注意力阅读或看电视', en: 'I find I cannot concentrate well enough to read or watch television' }, meaning: { zh: '无法专注阅读/看电视。', en: 'Cannot concentrate to read/watch TV.' } }
    ],
    explanation: { zh: '测量注意力困难，对应 DSM-5 思维/注意力减退标准。', en: 'Measures concentration difficulty; maps to the DSM-5 diminished-concentration criterion.' }
  },
  {
    id: 'bdii-20', domain: { zh: '疲倦 / 疲劳', en: 'Tiredness or Fatigue' }, dsm5: 'A6',
    text: { zh: '疲倦或疲劳', en: 'Tiredness or Fatigue' },
    options: [
      { value: 0, label: { zh: '我不比平时更容易疲倦', en: 'I am no more tired or fatigued than usual' }, meaning: { zh: '疲倦如常。', en: 'Fatigue unchanged.' } },
      { value: 1, label: { zh: '我比平时更容易疲倦', en: 'I get more tired or fatigued more easily than usual' }, meaning: { zh: '更易疲倦。', en: 'Tires more easily.' } },
      { value: 2, label: { zh: '我做几乎任何事都感到疲倦', en: 'I am too tired or fatigued to do a lot of the things I used to do' }, meaning: { zh: '做事即疲倦。', en: 'Too tired for usual activities.' } },
      { value: 3, label: { zh: '我疲倦得什么都做不了', en: 'I am too tired or fatigued to do most of the things I used to do' }, meaning: { zh: '疲劳致无法活动。', en: 'Fatigue prevents most activities.' } }
    ],
    explanation: { zh: '测量疲倦/疲劳，对应 DSM-5 疲劳标准。', en: 'Measures tiredness/fatigue; maps to the DSM-5 fatigue criterion.' }
  },
  {
    id: 'bdii-21', domain: { zh: '性兴趣丧失', en: 'Loss of Interest in Sex' },
    text: { zh: '性兴趣丧失', en: 'Loss of Interest in Sex' },
    options: [
      { value: 0, label: { zh: '我对性/亲密的兴趣没有变化', en: 'I have not noticed any recent change in my interest in sex' }, meaning: { zh: '性兴趣如常。', en: 'Interest in sex unchanged.' } },
      { value: 1, label: { zh: '我对性/亲密的兴趣比以前减退', en: 'I am less interested in sex than I used to be' }, meaning: { zh: '性兴趣减退。', en: 'Less interested in sex.' } },
      { value: 2, label: { zh: '我现在对性/亲密几乎不感兴趣', en: 'I have almost no interest in sex now' }, meaning: { zh: '性兴趣几近丧失。', en: 'Almost no interest in sex.' } },
      { value: 3, label: { zh: '我对性/亲密完全失去兴趣', en: 'I have lost interest in sex completely' }, meaning: { zh: '性兴趣完全丧失。', en: 'Interest in sex completely lost.' } }
    ],
    explanation: { zh: '测量性兴趣/亲密兴趣丧失，是快感缺失在亲密领域的具体表现。', en: 'Measures loss of interest in sex/intimacy, a concrete manifestation of anhedonia.' }
  }
]

export const bdii = {
  id: 'bdii',
  order: 50,
  name: { zh: 'BDI-II 贝克抑郁量表（第二版）', en: 'BDI-II Beck Depression Inventory-II' },
  shortName: { zh: 'BDI-II', en: 'BDI-II' },
  description: {
    zh: '国际经典的抑郁严重度自评量表，21 题、每题四个独立陈述，测量过去两周抑郁的认知-情感-躯体症状。',
    en: 'A classic international measure of depression severity; 21 items each with four unique statements, assessing cognitive-affective-somatic symptoms over the past two weeks.'
  },
  timeframe: {
    zh: '以下是关于你过去两周（含今天）的感受。请为每题选择最能描述你状态的一项。',
    en: 'These refer to how you have been feeling during the past two weeks, including today. For each item, pick the statement that best describes you.'
  },
  copyright: {
    status: 'proprietary-pearson',
    note: {
      zh: 'BDI-II 版权归 Pearson / The Psychological Corporation 所有。此处为临床忠实的自评表征，仅供个人/教育性筛查参考，不用于临床诊断、再分发或商业用途。',
      en: 'BDI-II is copyrighted by Pearson / The Psychological Corporation. This clinically faithful self-rating representation is for personal/educational screening reference only — not for clinical diagnosis, redistribution, or commercial use.'
    }
  },
  reference: 'Beck AT, Steer RA, Brown GK. Manual for the Beck Depression Inventory-II. San Antonio, TX: Psychological Corporation; 1996.',
  weight: 0.92,
  scoring: {
    type: 'sum',
    perItemMin: 0,
    perItemMax: 3,
    totalRange: [0, 63]
  },
  clinicalCutoff: 20,
  notableThreshold: 2,
  bands: [
    { max: 13, severity: 'minimal', label: { zh: '极轻度 / 无抑郁', en: 'Minimal / no depression' } },
    { max: 19, severity: 'mild', label: { zh: '轻度抑郁', en: 'Mild depression' } },
    { max: 28, severity: 'moderate', label: { zh: '中度抑郁', en: 'Moderate depression' } },
    { max: 63, severity: 'severe', label: { zh: '重度抑郁', en: 'Severe depression' } }
  ],
  bandAdvice: {
    minimal: {
      zh: 'BDI-II 得分处于极轻度范围（0–13）。继续保持健康作息与情绪觉察，如状态变化可复测。',
      en: 'The BDI-II score is in the minimal range (0-13). Maintain healthy routines and emotional awareness; re-test if your state changes.'
    },
    mild: {
      zh: 'BDI-II 得分提示轻度抑郁（14–19）。建议尝试自助方法（见知识库）并观察；若持续或加重，考虑专业评估。',
      en: 'The BDI-II score suggests mild depression (14-19). Try self-help (see the knowledge base) and monitor; if persistent or worsening, consider professional evaluation.'
    },
    moderate: {
      zh: 'BDI-II 得分提示中度抑郁（20–28）。建议寻求精神科/心理科专业评估，心理治疗（如 CBT）和/或药物可能有帮助。',
      en: 'The BDI-II score suggests moderate depression (20-28); seek professional psychiatric/psychological evaluation. Psychotherapy (e.g., CBT) and/or medication may help.'
    },
    severe: {
      zh: 'BDI-II 得分提示重度抑郁（29–63）。请尽快就医评估与治疗。若出现自伤/自杀念头，请立即联系危机热线或急诊。',
      en: 'The BDI-II score suggests severe depression (29-63); seek prompt medical evaluation and treatment. If you have thoughts of self-harm, contact a crisis line or emergency department immediately.'
    }
  },
  items
}

export default bdii

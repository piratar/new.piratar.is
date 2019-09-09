---
layout: default
title: Aðildarfélög
description: Aðildarfélög Pírata
---
{% assign list=site.associations | where: "lang", page.lang %}
{% include list-items.html list=list %}
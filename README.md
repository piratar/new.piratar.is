# new.piratar.is
Ný heimasíða Pírata - í vinnslu frá 2019

## Uppsetning

Þessi heimasíða er byggð með [Jekyll](https://jekyllrb.com/).

Til að búa síðuna til á þinni tölvu þarf fyrst að sækja síðuna, annað hvort **Download as Zip** eða með Git:

`git clone git@github.com:piratar/new.piratar.is.git`

Í möppunni er hægt að senda þessa skipun með terminal:

`jekyll serve` 

Jekyll býr til síðuna og ræsir hana á http://127.0.0.1:4000 á tölvunni þinni.


## Hvernig virkar Jekyll? Hvar byrja ég?

Íslenska index síðan eða Forsíðan er hér: `_pages-is/index.md`

Fyrstu 3 línurnar í þessu skjali nefnast [Front matter](https://jekyllrb.com/docs/front-matter/)

Þær skilgreina breytur og "layout". Þegar þetta er skrifað er `layout: frontpage` notað.

Þá er hægt að skoða `_layouts/frontpage.html` skjalið.

Jekyll er svo með fleiri stillingar í `_config.yml` skjalinu.

## Breytingabeiðnir (Pull request)

Endilega hjálpið okkur við að gera síðuna betri eða laga stafsetningarvillur osfrv.

Takk fyrir!

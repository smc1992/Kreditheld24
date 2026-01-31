
const entries = [
    {
        content: "Die Muskelhypothek bezeichnet die Anrechnung von Eigenleistungen als Eigenkapital bei einer Baufinanzierung. Banken akzeptieren in der Regel bis zu 10 bis 15 Prozent der Darlehenssumme als fiktives Eigenkapital durch handwerkliche Eigenleistung. In der Praxis wird die Anrechnung meist auf maximal 30.000 Euro begrenzt. Voraussetzung ist eine detaillierte Auflistung der Arbeiten und ggf. Kostenvoranschläge für Material und Lohnkosten professioneller Handwerker zum Vergleich.",
        source: "Expert-Guide: Baufinanzierung"
    },
    {
        content: "Seriöse Kredite ohne Schufa (oft als 'Schweizer Kredit' bezeichnet) stammen meist von ausländischen Banken (Liechtenstein/Schweiz). Wichtigste Merkmale für Seriosität im Jahr 2026: Keine Vorkosten, keine teuren Nachnahme-Zusendungen und keine Koppelungsgeschäfte mit unnötigen Versicherungen. Echte Schufa-freie Kredite haben oft starre Kreditsummen (z.B. 3.500€, 5.000€ oder 7.500€) und erfordern ein festes, pfändbares Einkommen über der Pfändungsfreigrenze.",
        source: "Bonität & Schufa-Guide"
    },
    {
        content: "Für Rentner gibt es in Deutschland keine gesetzliche Altersgrenze für Kredite, jedoch setzen Banken meist interne Grenzen (oft 75 bis 80 Jahre für die vollständige Tilgung). Tipps zur Kreditzusage für Senioren: Kurze Laufzeiten wählen, einen jüngeren Mitantragsteller (z.B. Kind) hinzunehmen oder Sicherheiten wie Immobilien oder LV-Guthaben hinterlegen. KfW-Förderungen für barrierereduzierendes Umbauen sind unabhängig vom Alter möglich.",
        source: "Kredit für Rentner FAQ"
    },
    {
        content: "Die KfW-Programme 297 und 298 fördern den klimafreundlichen Neubau von Wohngebäuden (Standard EH 40). Im Jahr 2026 ist die Förderung an den Ausschluss fossiler Heizsysteme gebunden; die Wärmeerzeugung muss zu 100% aus erneuerbaren Energien stammen. Eine EH 55 Förderung ist befristet wieder verfügbar, sofern die Baugenehmigung bereits vorliegt und das Budget noch nicht ausgeschöpft ist. Maximaler Kreditbetrag: 150.000€ pro Wohneinheit.",
        source: "KfW-Förderung 2026"
    },
    {
        content: "Bausparen dient 2026 primär als Instrument zur Zinssicherung für die Zukunft. Ein Bausparvertrag besteht aus der Sparphase (Aufbau Eigenkapital, geringe Guthabenzinsen ca. 0,1-0,3%) und der Darlehensphase (Anspruch auf ein zinsgünstiges Darlehen zu den bei Abschluss vereinbarten Konditionen). Besonders attraktiv ist dies für die Anschlussfinanzierung oder geplante Modernisierungen, um sich gegen steigende Marktzinsen (Prognose 2026: 3,9% - 4,5%) abzusichern.",
        source: "Finanzplanung: Bausparen"
    },
    {
        content: "Umschuldung von Studienkrediten: Absolventen mit dem KfW-Studienkredit können diesen nach Berufseinstieg oft in einen klassischen Ratenkredit umschulden. Da das Einkommen im Beruf meist stabil ist, bieten Banken deutlich bessere Zinsen als der variable Satz des KfW-Studienkredits. Dies spart über die lange Rückzahlungsdauer oft mehrere Tausend Euro Zinskosten.",
        source: "Studienkredit Umschuldung"
    },
    {
        content: "Ein Modernisierungskredit ist ein Ratenkredit zur Zweckbindung für Renovierungen. Bis zu einer Summe von 50.000 Euro verzichten viele Banken auf eine Grundschuldeintragung, was die Abwicklung beschleunigt und Kosten spart. Im Vergleich zur klassischen Baufinanzierung sind die Zinsen etwas höher, aber die Flexibilität (Sondertilgungen oft jederzeit kostenlos möglich) ist deutlich besser.",
        source: "Modernisierung & Sanierung"
    },
    {
        content: "Bauzinsen Prognose 2026: Experten erwarten für das Jahr 2026 eine Stabilisierung der Bauzinsen für 10-jährige Zinsbindungen in einem Korridor zwischen 3,5% und 4,5%. Die EZB-Leitzinsen werden voraussichtlich auf einem Niveau um 2,0% verharren. Für Kreditnehmer bedeutet dies, dass langfristige Planungssicherheit wichtiger ist als das Warten auf deutliche Zinssenkungen.",
        source: "Marktanalyse 2026"
    },
    {
        content: "Eine Restschuldversicherung (RSV) ist sinnvoll, wenn die Absicherung der Hinterbliebenen im Todesfall oder bei Arbeitsunfähigkeit oberste Priorität hat. Kritiker bemängeln die hohen Kosten, die oft direkt auf die Kreditsumme aufgeschlagen werden. Tipp: Oft ist eine separate Risikolebensversicherung kostengünstiger und bietet flexibleren Schutz als eine direkt an den Kredit gekoppelte RSV.",
        source: "Versicherung & Schutz"
    },
    {
        content: "Klimafreundlicher Neubau im Niedrigpreissegment (KfW 296): Dieses Programm wurde 2026 durch angehobene Baukostenobergrenzen (+18%) und die Anerkennung von Wohnküchen als Individualräume flexibler gestaltet. Ziel ist die Förderung von bezahlbarem und zugleich energetisch hochwertigem Wohnraum.",
        source: "KfW-Förderung 2026"
    }
];

async function ingest() {
    for (const entry of entries) {
        console.log(`Ingesting: ${entry.source}...`);
        try {
            const res = await fetch('http://localhost:3002/api/admin/knowledge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entry)
            });
            const data = await res.json();
            if (data.success) {
                console.log('Success!');
            } else {
                console.error('Failed:', data.error);
            }
        } catch (err) {
            console.error('Network error:', err);
        }
    }
}

ingest();

module.exports = async function handler(request, response) {
  const { city, start, end, interests = "" } = request.query;

  if (!city || !start || !end) {
    return response.status(400).json({
      error: "city, start and end are required",
    });
  }

  const apiKey = process.env.TICKETMASTER_API_KEY;
  if (!apiKey) {
    return response.status(200).json({
      live: false,
      checkedAt: new Date().toISOString(),
      events: [],
    });
  }

  const params = new URLSearchParams({
    apikey: apiKey,
    city,
    countryCode: "US",
    startDateTime: `${start}T00:00:00Z`,
    endDateTime: `${end}T23:59:59Z`,
    size: "12",
    sort: "date,asc",
  });

  if (String(interests).includes("music")) {
    params.set("classificationName", "music");
  } else if (String(interests).includes("sport")) {
    params.set("classificationName", "sports");
  }

  try {
    const ticketmaster = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?${params.toString()}`,
      { headers: { Accept: "application/json" } },
    );

    if (!ticketmaster.ok) throw new Error(`Ticketmaster ${ticketmaster.status}`);

    const payload = await ticketmaster.json();
    const events = (payload?._embedded?.events || []).map((event) => {
      const range = event.priceRanges?.[0];
      const currency = range?.currency || "USD";
      const price =
        typeof range?.min === "number"
          ? `${currency} ${range.min}${
              typeof range?.max === "number" ? `–${range.max}` : "+"
            }`
          : "მიმდინარე ფასი";

      return {
        name: event.name || "Event",
        venue: event._embedded?.venues?.[0]?.name || city,
        date: event.dates?.start?.localDate || start,
        time: event.dates?.start?.localTime || null,
        price,
        url: event.url || "https://www.ticketmaster.com/",
        category: event.classifications?.[0]?.segment?.name || "Live event",
      };
    });

    return response.status(200).json({
      live: true,
      checkedAt: new Date().toISOString(),
      events,
    });
  } catch {
    return response.status(200).json({
      live: false,
      checkedAt: new Date().toISOString(),
      events: [],
    });
  }
};

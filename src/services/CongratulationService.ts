import { ISPFXContext, SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/lists/web";
import { format } from "date-fns";

export default class congratulationService {
  public async getEventsByType(
    context: ISPFXContext,
    listUrl: string,
    type: number
  ): Promise<any[]> {
    const sp = spfi().using(SPFx(context));

    // Helper to fetch all items of the specified type
    const itemsFetched = await sp.web
      .getList(listUrl)
      .items.select(
        "*,eldGreetingType1/Title,eldGreetingType1/eldDaysBeforeEvent,eldGreetingType1/eldDaysAfterEvent,eldUser/Title,eldUser/EMail,eldUser/Department,eldUser/JobTitle,eldUser/LastName,eldUser/Department"
      )
      .expand("eldUser,eldGreetingType1")
      .filter(`eldGreetingType1Id eq ${type}`)
      .orderBy("eldDate", false)();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const filterItems = (date: Date) => {
      return itemsFetched.filter((item) => {
        const eladDate = new Date(item.eldDate);
        const itemDateFormatted = format(
          eladDate.setHours(0, 0, 0, 0),
          "MM-dd"
        );
        return (
          (type === 1 && itemDateFormatted === format(date, "MM-dd")) ||
          (type === 2 &&
            itemDateFormatted === format(date, "MM-dd") &&
            eladDate.getFullYear() !== date.getFullYear())
        );
      });
    };

    let items = filterItems(today);

    if (itemsFetched.length >= 3) {
      let otherDay = new Date(today);
      while (items.length < 3) {
        //as long as there is no 3 dates (to fill the dates windows) - bring dates from the next day
        otherDay.setDate(otherDay.getDate() - 1);
        items = items.concat(filterItems(otherDay).slice(0, 3 - items.length));
      }
    } else {
      items = itemsFetched;
    }
    return items;
  }

  public async getBirths(
    context: ISPFXContext,
    listUrl: string
  ): Promise<any[]> {
    const sp = spfi().using(SPFx(context));
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    const todayFormatted = format(today, "yyyy-MM-dd");
    const thirtyDaysAgoFormatted = format(thirtyDaysAgo, "yyyy-MM-dd");
    let items = await sp.web
      .getList(listUrl)
      .items.select(
        "*,eldGreetingType1/Title,eldGreetingType1/eldDaysBeforeEvent,eldGreetingType1/eldDaysAfterEvent,eldUser/Title,eldUser/EMail,eldUser/Department,eldUser/JobTitle,eldUser/LastName,eldUser/Department"
      )
      .expand("eldUser,eldGreetingType1")
      .filter(
        `eldDate ge '${thirtyDaysAgoFormatted}' and eldDate le '${todayFormatted}' and eldGreetingType1Id ne 2 and eldGreetingType1Id ne 1`
      )
      .orderBy("eldDate", false)();

    if (items.length === 0) {
      items = await sp.web
        .getList(listUrl)
        .items.select(
          "*,eldGreetingType1/Title,eldGreetingType1/eldDaysBeforeEvent,eldGreetingType1/eldDaysAfterEvent,eldUser/Title,eldUser/EMail,eldUser/Department,eldUser/JobTitle,eldUser/LastName,eldUser/Department"
        )
        .expand("eldUser,eldGreetingType1")
        .orderBy("eldDate", false)
        .top(3)();
    }

    return items;
  }

  public async getMonthCongrats(
    context: ISPFXContext,
    listUrl: string,
    type: number
  ): Promise<any[]> {
    const sp = spfi().using(SPFx(context));
    // Determine the first and last day of the current month
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1
    );

    // Format dates for filtering
    const firstDayFormatted = format(firstDayOfMonth, "yyyy-MM-dd");
    const lastDayFormatted = format(lastDayOfMonth, "yyyy-MM-dd");
    let items;
    if (type === 3) {
      //לידות
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      const todayFormatted = format(today, "yyyy-MM-dd");
      const thirtyDaysAgoFormatted = format(thirtyDaysAgo, "yyyy-MM-dd");
      items = await sp.web
        .getList(listUrl)
        .items.select(
          "*,eldGreetingType1/Title,eldGreetingType1/eldDaysBeforeEvent,eldGreetingType1/eldDaysAfterEvent,eldUser/Title,eldUser/EMail,eldUser/Department,eldUser/JobTitle,eldUser/LastName,eldUser/Department"
        )
        .expand("eldUser,eldGreetingType1")
        .filter(
          `eldDate ge '${thirtyDaysAgoFormatted}' and eldDate le '${todayFormatted}' and eldGreetingType1Id ne 2 and eldGreetingType1Id ne 1`
        )
        .orderBy("eldDate", true)();
    } else if (type === 1) {
      //ימי הולדת
      let allItems = [];
      let hasMore = true;
      let skip = 0;
      const pageSize = 5000;

      while (hasMore) {
        try {
          const result = await sp.web
            .getList(listUrl)
            .items.select(
              "*,eldGreetingType1/Title,eldGreetingType1/eldDaysBeforeEvent,eldGreetingType1/eldDaysAfterEvent,eldUser/Title,eldUser/EMail,eldUser/Department,eldUser/JobTitle,eldUser/LastName,eldUser/Department"
            )
            .expand("eldUser,eldGreetingType1")
            .filter(
              `eldDate ge '${firstDayFormatted}' and eldDate le '${lastDayFormatted}' and eldGreetingType1Id eq ${type}`
            )
            .orderBy("eldDate", true)
            .top(pageSize)
            .skip(skip)();
          allItems = allItems.concat(result);
          if (result.length < pageSize) {
            hasMore = false;
            console.log(`Reached end of date-filtered data. Total items fetched: ${allItems.length}`);
          } else {
            skip += pageSize;
          }
        } catch (error) {
          console.error(`Error fetching page with skip ${skip}:`, error);
          hasMore = false;
        }
      }

      items = allItems;
    } else {
      //2 - תדהרהולדת
      let allItems = [];
      let hasMore = true;
      let skip = 0;
      const pageSize = 5000; // SharePoint's maximum page size

      console.log(`Starting to fetch tidhar birthdays with pagination...`);

      while (hasMore) {
        try {
          const result = await sp.web
            .getList(listUrl)
            .items.select(
              "*,eldGreetingType1/Title,eldGreetingType1/eldDaysBeforeEvent,eldGreetingType1/eldDaysAfterEvent,eldUser/Title,eldUser/EMail,eldUser/Department,eldUser/JobTitle,eldUser/LastName,eldUser/Department"
            )
            .expand("eldUser,eldGreetingType1")
            .filter(`eldGreetingType1Id eq ${type}`)
            .orderBy("eldDate", true)
            .top(pageSize)
            .skip(skip)();

          allItems = allItems.concat(result);

          // If we got less than pageSize, we've reached the end
          if (result.length < pageSize) {
            hasMore = false;
            console.log(`Reached end of data. Total items fetched: ${allItems.length}`);
          } else {
            skip += pageSize;
          }
        } catch (error) {
          console.error(`Error fetching page with skip ${skip}:`, error);
          hasMore = false;
        }
      }
      items = allItems;
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      const filteredItems = items.filter((item) => {
        const itemDate = new Date(item.eldDate);
        const itemMonth = itemDate.getMonth();
        const itemYear = itemDate.getFullYear();

        // Check if the item's date is in the past 30 days and not from the current year
        return itemMonth === currentMonth && itemYear !== currentYear;
      });

      items = filteredItems.sort((a, b) => {
        const dateA = new Date(a.eldDate);
        const dateB = new Date(b.eldDate);

        // Extract month and day
        const monthA = dateA.getMonth();
        const dayA = dateA.getDate();
        const monthB = dateB.getMonth();
        const dayB = dateB.getDate();

        // Compare months first, then days if months are the same
        if (monthA !== monthB) {
          return monthA - monthB;
        }
        return dayA - dayB;
      });
    }

    return items;
  }
}
export const CongratulationService = new congratulationService();

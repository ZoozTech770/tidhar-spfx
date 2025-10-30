# Connecting JobsFilter to Content Query Web Part

## What I Did

I updated the JobsFilter web part to work in **TWO ways simultaneously**:

### 1. **URL Query Parameters** ✅
When you select filters, the URL automatically updates with parameters:
- `?search=text` - Free text search
- `?unit=IT` - Selected unit
- `?manager=John` - Selected manager

### 2. **Dynamic Data Source** ✅
The web part publishes filter data that other web parts can consume via SharePoint's Dynamic Data feature.

---

## How to Use It

### Option A: Configure Content Query to Read URL Parameters

1. **Deploy the JobsFilter web part** to your AllJobs page
2. **Edit your Content Query web part** template to read URL parameters
3. **Update the Handlebars template** to filter based on URL params

#### Update Your Handlebars Template:

Add this JavaScript at the top of your template:

```handlebars
<script>
(function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const searchText = urlParams.get('search');
    const unitFilter = urlParams.get('unit');
    const managerFilter = urlParams.get('manager');
    
    // Function to check if job matches filters
    window.matchesJobFilters = function(job) {
        // Free text search
        if (searchText) {
            const search = searchText.toLowerCase();
            const title = (job.Title || '').toLowerCase();
            const desc = (job.eldJobSummery || '').toLowerCase();
            const unit = (job.eldUnit || '').toLowerCase();
            const manager = (job.eldHiringManagerUser || '').toLowerCase();
            
            if (!title.includes(search) && 
                !desc.includes(search) && 
                !unit.includes(search) && 
                !manager.includes(search)) {
                return false;
            }
        }
        
        // Unit filter
        if (unitFilter && job.eldUnit !== unitFilter) {
            return false;
        }
        
        // Manager filter
        if (managerFilter && job.eldHiringManagerUser !== managerFilter) {
            return false;
        }
        
        return true;
    };
})();
</script>

<div class="job-cards">
    {{#each items}}
        {{#if (matchesJobFilters this)}}
        <a target="_blank" href="https://tidharconil.sharepoint.com/sites/PortalTidhar/SitePages/Jobpage.aspx?PageID={{ID.textValue}}" class="job-link">
            <div class="job-card">
                <div class="description-container">
                    <h4 class="job-title">{{Title.textValue}}</h4>
                    <p class="job-description">{{{eldJobSummery.textValue}}}</p>
                    <p class="job-details" dir="ltr">
                        {{eldUnit.textValue}} {{#if eldUnit.textValue}}|{{/if}} {{eldHiringManagerUser.textValue}}
                    </p>
                </div>
                <img class="arrow" src="https://tidharconil.sharepoint.com/sites/apps/ClientSideAssets/96860edb-8967-40fa-a7d2-82cd6f80328b/ArrowRight_3f24c9130a3ffcb96bd6.svg"/>
            </div>
        </a>
        <hr>
        {{/if}}
    {{/each}}
</div>
```

**Note:** Handlebars doesn't support custom helper functions like `matchesJobFilters` by default in SharePoint. You may need to use a different approach.

---

### Option B: Use Content Query's Built-in Filtering

The Content Query web part has built-in filtering capabilities. You can:

1. Add the JobsFilter web part above the Content Query
2. Use Dynamic Data connection (if supported by Content Query)
3. Or manually configure filters in Content Query settings

---

### Option C: Simplest Solution - Use My Component's Display

Since I already built job display into the filter component:

1. **Remove the Content Query web part** (or hide it)
2. **Use only the JobsFilter web part**
3. It will fetch and display filtered jobs automatically

This is the **easiest and most reliable** solution since everything is integrated.

---

## Testing

1. **Build and deploy**:
   ```powershell
   gulp bundle --ship
   gulp package-solution --ship
   ```

2. **Add the web part** to AllJobs page

3. **Test filtering**:
   - Type in search box - URL should update with `?search=...`
   - Select a unit - URL should update with `?unit=...`
   - Select a manager - URL should update with `?manager=...`
   - Click "נקה סינון" - URL parameters should clear

4. **Check if Content Query responds**:
   - If it doesn't filter automatically, you'll need to modify the Handlebars template

---

## My Recommendation

**Use Option C** - Let my JobsFilter component handle both filtering AND display. It's:
- ✅ Fully integrated
- ✅ Works immediately
- ✅ Easier to maintain
- ✅ Better user experience

The Content Query approach requires complex template modifications and may not work reliably.

---

## Need Help?

If you want me to:
1. Create a custom template for Content Query
2. Build a completely custom AllJobs display component
3. Something else

Just let me know!

import altair as alt
import pandas as pd
import warnings
warnings.filterwarnings('ignore', category=UserWarning, module='altair')
warnings.filterwarnings('ignore', category=FutureWarning, module='altair')

select_bar = alt.selection_point(fields=['track_name'], empty=True)


top30 = (
    spotify
    .sort_values('popularity', ascending=False)
    .drop_duplicates(subset='track_name') 
    .head(30)
)

legend_color = ['#4FBD1C', '#FF9100', '#F701FF', '#0492FF']


decade = (
    alt.Chart(top30)
    .mark_bar()
    .encode(
        x=alt.X('popularity:Q', title='Popularity (0–100)'),   
        y=alt.Y('track_name:N', sort='-x', title='Track Name'),
        color=alt.condition(
            select_bar,
            alt.Color('decade:O', scale=alt.Scale(range=legend_color)),
            alt.value('lightgray') 
        ),
        opacity=alt.condition(select_bar, alt.value(1), alt.value(0.2)),
        tooltip=['track_name', 'popularity', 'decade'],
    )
    .add_params(select_bar) 
    .properties(
        width=700,
        height=500,
        title={
            "text": "Decade Popularity by Track",
            "subtitle": "Showing the top 30 selected tracks, to highlight track click bar and double click to exit",
            "fontSize": 22,
            "subtitleFontSize": 13
        }
    )
)

decade.save('decade.html')

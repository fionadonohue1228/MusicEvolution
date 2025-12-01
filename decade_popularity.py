import altair as alt
import pandas as pd

spotify_rand = spotify.sample(n=100, random_state=42)

slider = alt.binding_range(min=0.05, max=1, step=0.05, name="Decade:")
op_var = alt.param(value=0.5, bind=slider)

decade = alt.Chart(spotify_rand).mark_bar().encode(
    x=alt.X('track_name:N', title='Track Name'),
    y=alt.Y('popularity:Q', title='Popularity (0-100)'),
    color=alt.Color('decade:Q', title='Decade (1960-2025)'),
    opacity=alt.OpacityValue(op_var)
).add_params(
    op_var
).properties(
    width=1000,
    height=500,
    title={
        "text": "Popularity Evolution: Decade Popularity by Track",
        "subtitle": "Showing 100 randomly selected tracks",
        "fontSize": 22,
        "subtitleFontSize": 13
    }
)
decade.save("decade_pop.html")

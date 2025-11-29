import altair as alt
import pandas as pd

spotify_rand = spotify.sample(n=50, random_state=42)

slider = alt.binding_range(min=0.05, max=1, step=0.05, name="Popularity:")
op_var = alt.param(value=0.5, bind=slider)

chart = alt.Chart(spotify_rand).mark_bar().encode(
    x=alt.X('track_name:N', title='Track Name'),
    y=alt.Y('danceability:Q', title='Danceability'),
    color=alt.Color('popularity:Q', title='Popularity'),
    opacity=alt.OpacityValue(op_var)
).add_params(
    op_var
).properties(
    width=1000,
    height=500,
    title='Danceability Popularity by Track'
)



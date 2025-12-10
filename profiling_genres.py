import pandas as pd
import altair as alt

df = pd.read_csv('15000_tracks_cleaned.csv')

top_genres = df['track_genre'].value_counts().head(8).index.tolist()
genre_df = df[df['track_genre'].isin(top_genres)]

genre_features = genre_df.groupby('track_genre').agg({
    'energy': 'mean',
    'danceability': 'mean',
    'valence': 'mean',
    'acousticness': 'mean',
    'speechiness': 'mean'
}).reset_index()

for col in ['energy', 'danceability', 'valence', 'acousticness', 'speechiness']:
    genre_features[col] = genre_features[col] * 100

feature_long = genre_features.melt(
    id_vars=['track_genre'],
    value_vars=['energy', 'danceability', 'valence', 'acousticness', 'speechiness'],
    var_name='feature',
    value_name='value'
)

feature_names = {
    'energy': 'Energy',
    'danceability': 'Danceability',
    'valence': 'Valence',
    'acousticness': 'Acousticness',
    'speechiness': 'Speechiness'
}

feature_long['feature'] = feature_long['feature'].map(feature_names)

feature_selection = alt.selection_point(fields=['feature'], bind='legend')
genre_highlight = alt.selection_point(fields=['feature'], on='click', nearest=False)

chart = (alt.Chart(feature_long).mark_bar().encode(
    x=alt.X('track_genre:N',
            title='Genre',
            axis=alt.Axis(labelAngle=-45, labelFontSize=14, titleFontSize=18)),
    y=alt.Y('value:Q',
            title='Average Value per Song (0-100)',
            scale=alt.Scale(domain=[0, 100]),
            axis=alt.Axis(labelFontSize=14, titleFontSize=18)),

    color=alt.condition(
        feature_selection | genre_highlight,
        alt.Color('feature:N',
                  title='Feature',
                  scale=alt.Scale(
                      domain=['Acousticness', 'Danceability', 'Energy', 'Speechiness', 'Valence'],
                      range=['teal', 'orange', 'steelblue', 'yellowgreen', 'pink']
                  ),
                  legend=alt.Legend(
                      orient='top',
                      titleFontSize=18,
                      labelFontSize=13,
                      symbolSize=200,
                      direction='horizontal'
                  )),
        alt.value('white')
    ),

    stroke=alt.condition(
        genre_highlight,
        alt.value('black'),
        alt.value(None)
    ),
    strokeWidth=alt.condition(
        genre_highlight,
        alt.value(2),
        alt.value(1)
    ),
    xOffset='feature:N',
    tooltip=[
        alt.Tooltip('track_genre:N', title='Genre'),
        alt.Tooltip('feature:N', title='Feature'),
        alt.Tooltip('value:Q', title='Value', format='.1f'),
    ]).add_params(
    feature_selection,
    genre_highlight).properties(
    width=900,
    height=500,
    title={
        "text": "Comparative Genre Analysis: Audio Profiles",
        "subtitle": "Click legend or a bar to highlight a feature across all genres",
        "anchor": "start",
        "offset": 20,
        "fontSize": 22,
        "subtitleFontSize": 13, }
))

chart.save('alt_genre_profiles.html')
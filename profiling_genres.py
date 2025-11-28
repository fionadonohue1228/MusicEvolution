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
}).reset_index()

for col in ['energy', 'danceability', 'valence', 'acousticness']:
    genre_features[col] = genre_features[col] * 100

feature_long = genre_features.melt(
    id_vars=['track_genre'],
    value_vars=['energy', 'danceability', 'valence', 'acousticness'],
    var_name='feature',
    value_name='value',
)

feature_names = {
    'energy': 'Energy',
    'danceability': 'Danceability',
    'valence': 'Valence',
    'acousticness': 'Acousticness',
}

feature_long['feature'] = feature_long['feature'].map(feature_names)

chart = alt.Chart(feature_long).mark_bar().encode(
    x=alt.X('feature:N',
            title='Audio Feature',
            axis=alt.Axis(labelAngle=0, labelFontSize=14, titleFontSize=18)),
    y=alt.Y('value:Q',
            title='Average Value per Song (0-100)',
            scale=alt.Scale(domain=[0, 100]),
            axis=alt.Axis(labelFontSize=14, titleFontSize=18)),
    color=alt.Color('track_genre:N',
                    title='Genre',
                    scale=alt.Scale(scheme='set2'),
                    legend=alt.Legend(
                        orient='right',
                        titleFontSize=18,
                        labelFontSize=12
                    )),
    xOffset='track_genre:N',
    tooltip=[
        alt.Tooltip('track_genre:N', title='Genre'),
        alt.Tooltip('feature:N', title='Feature'),
        alt.Tooltip('value:Q', title='Value', format='.1f'),
    ]).properties(
    width=900,
    height=500,
    title={
        "text": "Comparative Genre Analysis: Audio Profiles",
        "subtitle": "Measuring energy, danceability, valence, and acousticness across top genres",
        "fontSize": 22,
        "subtitleFontSize": 13,}





)

chart.save('alt_genre_profiles.html')
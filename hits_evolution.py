import pandas as pd
import altair as alt


df = pd.read_csv('15000_tracks_cleaned.csv')
df = df[(df['year'] >= 1980) & (df['year'] <= 2020)]

hits_df = df[df['is_hit'] == True].copy()
hits_df['period'] = (hits_df['year'] // 5) * 5
period_features = hits_df.groupby('period').agg({
    'energy': 'mean',
    'danceability': 'mean',
    'valence': 'mean',
    'acousticness': 'mean',
    'speechiness': 'mean',
}).reset_index()

for col in ['energy', 'danceability', 'valence', 'acousticness', 'speechiness']:
    period_features[col] = period_features[col] * 100

feature_long = period_features.melt(
    id_vars=['period'],
    value_vars=['energy', 'danceability', 'valence', 'acousticness', 'speechiness'],
    var_name='feature',
    value_name='value',


)

feature_names = {
    'energy': 'Energy',
    'danceability': 'Danceability',
    'valence': 'Valence',
    'acousticness': 'Acousticness',
    'speechiness': 'Speechiness',

}
feature_long['feature_label'] = feature_long['feature'].map(feature_names)

feature_dropdown = alt.binding_select(
    options = ['All', 'Acousticness', 'Danceability', 'Energy', 'Speechiness', 'Valence'],
    name = 'Select feature: '
)
feature_param = alt.param(
    name = 'selected_feature',
    value = 'All',
    bind = feature_dropdown
)

feature_chart = alt.Chart(feature_long).mark_line(
    point=True,
    strokeWidth=4
).encode(
    x=alt.X('period:O',
            title='Year',
            axis=alt.Axis(labelAngle=0, labelFontSize=14, titleFontSize=18)),
    y=alt.Y('value:Q',
            title='Average Value per Song (0-100)',
            scale=alt.Scale(domain=[0, 100]),
            axis=alt.Axis(labelFontSize=14, titleFontSize=18)),
    color=alt.Color('feature_label:N',
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
    opacity=alt.condition(
        (feature_param == 'All') | (alt.datum.feature_label == feature_param),
        alt.value(1),
        alt.value(0)
    ),
    tooltip=[
        alt.Tooltip('period:O', title='Period'),
        alt.Tooltip('feature_label:N', title='Feature'),
        alt.Tooltip('value:Q', title='Value', format='.1f')
    ]
).add_params(
    feature_param
).properties(
    width=900,
    height=500,
    title={
        "text": "Hit Songs Evolution: How Successful Music Changed (1980-2020)",
        "subtitle": "Analyzing only songs with 70.0+ popularity",
        "fontSize": 22,
        "subtitleFontSize": 13,
    }).configure_axis(
    grid=True,
    gridOpacity=0.3,
    titleFontSize=18)

feature_chart.save('alt_hit_songs_evolution.html')
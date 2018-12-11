FROM noonat/ruby-node as build

RUN mkdir /doubtfire-web
WORKDIR /doubtfire-web

ENV NODE_ENV docker

# Ruby required for SASS
RUN gem install sass

RUN npm install -g grunt-cli bower
RUN nodenv rehash

# To rebuild Docker image faster, copy dependency information files only
COPY .bowerrc bower.json /doubtfire-web/
RUN bower install --allow-root
COPY package.json package-lock.json /doubtfire-web/
RUN npm install

############################

FROM build as development

EXPOSE 8000
EXPOSE 8080
CMD npm start

############################

FROM build as deploy

COPY . /doubtfire-web/
RUN grunt build

# CMDs runs when compose is up'd
RUN mkdir build2
CMD cp -r build/* build2/
